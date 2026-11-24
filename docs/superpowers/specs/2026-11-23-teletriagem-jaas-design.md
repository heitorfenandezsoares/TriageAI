# Design: Tele-triagem por vídeo com Jitsi as a Service (JaaS)

Data: 2026-11-23 · Tamanho: mudança pequena/média (design curto)

## Intenção e porquê
A entrevista online (profissional + paciente) precisa funcionar de forma confiável. Hoje o vídeo usa
servidores públicos de Jitsi (`meet.jit.si` / `meet.ffmuc.net`), que podem exigir login de moderador,
cortar a chamada depois de ~5 minutos ou ficar fora do ar. A sala também é nomeada com o e-mail do
paciente (previsível): qualquer pessoa que adivinhe entra numa consulta de saúde.
Projeto de TCC, a API pode mudar. O vídeo continua fora da Hostinger (plano compartilhado não roda
servidor de vídeo).

## Objetivos
- Chamada estável, sem limite de 5 min nem login de moderador.
- Só quem o backend autorizar entra na sala; profissional entra como moderador.
- Nome de sala aleatório e não adivinhável (nunca e-mail).
- Fácil trocar de provedor depois (opção B: LiveKit) sem reescrever as telas.

## Não objetivos
- Gravação, chat persistente, telas novas, servidor de vídeo próprio.
- Migrar para LiveKit agora (só deixar a porta aberta).

## Anti-objetivos
- Chave privada ou qualquer segredo do JaaS no frontend ou no git.
- Quebrar o fluxo atual: botão "Entrar em Sala de Vídeo" da pré-triagem, sala manual e link para o paciente.

## Abordagens consideradas
- **A. JaaS (escolhida pelo usuário):** continua Jitsi, menor mudança, token JWT emitido pelo backend.
- B. LiveKit Cloud: mais customizável e com opção de hospedar depois; exige reescrever o componente de vídeo. Fica como evolução futura.
- C. Daily: API simples, mas proprietária.
- Descartadas: servidor próprio em VPS (custo/operação) e WebRTC puro (precisa de WebSocket e TURN).

## Design

### Backend (novo módulo `telemedicine`)
- **Entidade `tele_rooms`**: `id` (código aleatório, ex. 16 bytes em base64url), `pacienteId` (nullable),
  `criadoPor` (e-mail do profissional), `expiraEm`, `criadoEm`.
  *Como `synchronize` agora é off, a tabela entra por SQL em `database_hostinger.sql` (e deve ser rodada no servidor).*
- `POST /telemedicine/rooms` (`@Roles` profissionais; body opcional `{ pacienteId }`): cria sala, devolve `{ sala, expiraEm }`.
- `POST /telemedicine/token` (qualquer autenticado; body `{ sala }`): valida sala existente e não expirada e a permissão:
  - profissional: entra em qualquer sala, como moderador;
  - paciente: só se `pacienteId` da sala for ele (e-mail ou id do token) **ou** a sala não tiver paciente fixo (o código aleatório do link é a credencial; ainda exige login).
  Resposta: `{ provider: 'jaas', domain: '8x8.vc', appId, roomName, jwt }`.
- **Assinatura do JWT**: `JwtService.signAsync` do `@nestjs/jwt` já instalado, algoritmo RS256 com a chave privada do JaaS
  e `keyid` no header; validade curta (ex. 2 h). Claims do JaaS (`aud`, `iss`, `sub`, `room`, `context.user`, `moderator`)
  a confirmar na documentação do painel JaaS durante a implementação.
- **Env**: `JAAS_APP_ID`, `JAAS_KID`, `JAAS_PRIVATE_KEY` (PEM, com `\n`). Se faltar, o endpoint responde 503 com mensagem clara.

### Frontend
- `SalaVideoTriagem` deixa de montar o nome da sala e de escolher servidor. Passa a receber a sessão do backend
  (`{ provider, domain, appId, roomName, jwt }`) e renderiza conforme `provider` (hoje só `'jaas'`).
  Trocar para LiveKit depois = novo ramo de `provider` + nova função de token no backend.
- Carrega `https://8x8.vc/<appId>/external_api.js`, usa `roomName = <appId>/<sala>` e o `jwt`.
- Remove o seletor de servidor e o fallback para `meet.ffmuc.net`/`meet.jit.si`, e `extrairCodigoSala` para e-mails.
- Profissional: "Entrar em Sala de Vídeo" (pré-triagem) cria a sala com `pacienteId` e abre; sala manual cria sem paciente;
  o link gerado é `#/entrevista?sala=<codigo>`.
- Paciente: ao abrir o link (ou ao ser chamado) pede o token do código; erro 403/404/expirada mostra mensagem amigável.

## Decisões minhas (para você conferir)
- Tabela `tele_rooms` em vez de código assinado sem estado (permite expirar e revogar; custo: rodar um SQL).
- Validade da sala de 24 h e do token de 2 h.
- Paciente sem `pacienteId` fixo entra com o link aleatório + login.
- Sem novas dependências npm (usa o `@nestjs/jwt` existente).

## Fica para quem constrói
- Detalhes exatos dos claims e do `kid` do JaaS; textos de erro; estilo dos estados de carregando/erro.
- Testes: unitários do serviço de salas/token (permissões) e verificação manual com duas contas (profissional e paciente).

## Pré-requisito do usuário
Criar conta gratuita no JaaS (8x8), gerar a API key (par de chaves) e guardar `appId`, `kid` e a chave privada
(o `.env` do servidor, nunca o git).
