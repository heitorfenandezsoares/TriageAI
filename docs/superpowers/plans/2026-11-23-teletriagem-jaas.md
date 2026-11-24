# Tele-triagem com JaaS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fazer a entrevista por vídeo funcionar de forma estável e privada: salas aleatórias autorizadas pelo backend, com JWT do Jitsi as a Service (8x8.vc).

**Architecture:** Novo módulo NestJS `telemedicine` cria salas (`tele_rooms`) e emite tokens JWT RS256 do JaaS (moderador para profissional). O frontend deixa de montar nome de sala e escolher servidor: `SalaVideoTriagem` pede a sessão ao backend e renderiza conforme o campo `provider` (hoje só `'jaas'`), deixando a troca futura para LiveKit isolada.

**Tech Stack:** NestJS 12 + TypeORM (MySQL) + `@nestjs/jwt` (já instalado) + Vitest; React 19 + Vite; Jitsi iframe API (`8x8.vc`).

**Spec:** `docs/superpowers/specs/2026-11-23-teletriagem-jaas-design.md`

## Global Constraints

- Sem novas dependências npm (`node_modules` está versionado no git).
- Segredos só em variáveis de ambiente: `JAAS_APP_ID`, `JAAS_KID`, `JAAS_PRIVATE_KEY` (PEM; aceita `\n` literais). Nunca no frontend nem no git.
- Sala: código aleatório (nunca e-mail), validade 24 h. Token JWT: validade 2 h, `aud: 'jitsi'`, `iss: 'chat'`, `sub: <appId>`, `room: <sala>`, header `kid`.
- Profissional entra como moderador (`context.user.moderator: 'true'`); paciente não (`'false'`).
- Resposta do token: `{ provider: 'jaas', domain: '8x8.vc', appId, roomName: '<appId>/<sala>', jwt }`.
- Imports do backend terminam em `.js` (ESM). `synchronize` está desligado: tabela nova entra por SQL.
- Não commitar sem o usuário pedir; os passos "Commit" valem só se ele autorizar.
- Backend: `cd backend && npx vitest run <arquivo>`. Os 7 specs `should be defined` já falham desde antes; ignore-os. Frontend não tem runner de testes: valida-se com `npm run build` e teste manual.

## Review Focus

- Sala expirada ou inexistente: backend 404, tela mostra mensagem (não fica em spinner).
- Paciente tentando a sala de outro paciente: 403.
- `JAAS_*` ausente: 503 com mensagem clara, e a tela mostra o erro.
- Chave privada com `\n` literais no `.env`: o token ainda é assinado.
- E-mail do paciente com maiúsculas/espaços: a comparação com a sala ignora caixa e espaços.

---

### Task 1: Assinador de token JaaS

**Files:**
- Create: `backend/src/telemedicine/jaas-token.ts`
- Test: `backend/src/telemedicine/jaas-token.spec.ts`

**Interfaces:**
- Consumes: `UsuarioToken` de `backend/src/auth/auth.guard.ts`; `JwtService` de `@nestjs/jwt`.
- Produces:
  - `export interface JaasConfig { appId: string; kid: string; privateKey: string }`
  - `export function normalizarChavePrivada(raw: string): string` (troca `\n` literal por quebra de linha real e faz trim)
  - `export async function assinarTokenJaas(jwt: JwtService, cfg: JaasConfig, entrada: { sala: string; usuario: UsuarioToken; moderador: boolean }): Promise<string>`

- [ ] **Step 1: Escrever os testes que falham** em `jaas-token.spec.ts`. Gerar um par RSA com `generateKeyPairSync('rsa', { modulusLength: 2048, ... })` (PEM pkcs8/spki). Testes:
  - `assina RS256 com kid, aud 'jitsi', iss 'chat', sub = appId e room = sala` (verificar com `new JwtService().verifyAsync(token, { publicKey, algorithms: ['RS256'] })` e decodificar o header para `kid`).
  - `moderador true gera context.user.moderator === 'true' e false gera 'false'`; `context.user` contém `id` (string do `sub`), `name`, `email`.
  - `expira em 2h` (`exp - iat === 7200`).
  - `aceita chave com \\n literais` (passar `privateKey.replace(/\n/g, '\\n')` e assinar sem erro).
- [ ] **Step 2: Rodar e ver falhar:** `cd backend && npx vitest run src/telemedicine/jaas-token.spec.ts` → FAIL (módulo não existe).
- [ ] **Step 3: Implementar** as duas funções em `jaas-token.ts` usando `jwt.signAsync(payload, { algorithm: 'RS256', privateKey, keyid: cfg.kid, expiresIn: '2h', audience: 'jitsi', issuer: 'chat', subject: cfg.appId })`. Payload: `{ room: sala, context: { user: {...}, features: { livestreaming: false, recording: false, transcription: false, 'outbound-call': false } } }`. Confirmar nomes dos claims na documentação do painel JaaS; se divergirem, ajustar o código e os testes.
- [ ] **Step 4: Rodar e ver passar** (mesmo comando) → PASS.
- [ ] **Step 5: Commit** — `feat(telemedicine): assinador de JWT do JaaS`

### Task 2: Entidade e serviço de salas

**Files:**
- Create: `backend/src/telemedicine/tele-room.entity.ts`, `backend/src/telemedicine/telemedicine.service.ts`, `backend/src/telemedicine/telemedicine.types.ts`
- Modify: `database_hostinger.sql` e `backend/database_hostinger.sql` (adicionar `CREATE TABLE IF NOT EXISTS tele_rooms`)
- Test: `backend/src/telemedicine/telemedicine.service.spec.ts`

**Interfaces:**
- Consumes: Task 1 (`assinarTokenJaas`, `normalizarChavePrivada`, `JaasConfig`).
- Produces:
  - `TeleRoom` (`@Entity('tele_rooms')`): `id: string` (PrimaryColumn varchar 64), `pacienteId: string | null` (nullable varchar 254), `criadoPor: string`, `expiraEm: Date`, `criadoEm: Date` (CreateDateColumn).
  - `export interface SessaoVideo { provider: 'jaas'; domain: string; appId: string; roomName: string; jwt: string }`
  - `TelemedicineService` com `createRoom(criadoPor: string, pacienteId?: string): Promise<{ sala: string; expiraEm: Date }>` e `issueToken(sala: string, user: UsuarioToken): Promise<SessaoVideo>`; construtor `(@InjectRepository(TeleRoom) repo: Repository<TeleRoom>, jwt: JwtService, config: ConfigService)`.

- [ ] **Step 1: Escrever os testes que falham** (repo mockado com `save`/`findOne` via `vi.fn()`, `JwtService` real, `ConfigService` mockado, chave RSA gerada):
  - `createRoom gera id aleatório base64url com ao menos 22 caracteres, expira em ~24h e duas chamadas dão ids diferentes`
  - `createRoom normaliza pacienteId (trim + minúsculas) e salva null quando ausente`
  - `issueToken de profissional devolve provider 'jaas', domain '8x8.vc', roomName '<appId>/<sala>' e jwt com moderator 'true'`
  - `issueToken de paciente em sala sem pacienteId funciona com moderator 'false'`
  - `issueToken de paciente dono da sala funciona mesmo com e-mail em caixa diferente`
  - `issueToken de outro paciente lança ForbiddenException`
  - `issueToken lança NotFoundException para sala inexistente e para sala expirada`
  - `issueToken lança ServiceUnavailableException quando JAAS_APP_ID, JAAS_KID ou JAAS_PRIVATE_KEY faltam`
- [ ] **Step 2: Rodar e ver falhar:** `npx vitest run src/telemedicine/telemedicine.service.spec.ts` → FAIL.
- [ ] **Step 3: Implementar** entidade, tipos e serviço. Id com `randomBytes(16).toString('base64url')`; constante `VALIDADE_SALA_HORAS = 24`. Perfil comparado em minúsculas, `'paciente'` = não moderador; qualquer perfil profissional = moderador. Paciente é dono se `pacienteId` for `user.email` ou `String(user.sub)` (comparação case-insensitive).
- [ ] **Step 4: SQL:** adicionar às duas cópias de `database_hostinger.sql` a tabela com as colunas da entidade (`id VARCHAR(64) PRIMARY KEY`, `pacienteId VARCHAR(254) NULL`, `criadoPor VARCHAR(254) NOT NULL`, `expiraEm DATETIME NOT NULL`, `criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP`).
- [ ] **Step 5: Rodar e ver passar** → PASS.
- [ ] **Step 6: Commit** — `feat(telemedicine): salas e emissão de token`

### Task 3: Controller, módulo e variáveis de ambiente

**Files:**
- Create: `backend/src/telemedicine/telemedicine.controller.ts`, `backend/src/telemedicine/telemedicine.module.ts`, `backend/.env.example`
- Modify: `backend/src/app.module.ts` (importar `TelemedicineModule`)
- Test: `backend/src/telemedicine/telemedicine.controller.spec.ts`

**Interfaces:**
- Consumes: Task 2 (`TelemedicineService`), `Roles`/`PROFISSIONAIS`/`ROLES_KEY` de `auth/roles.decorator.js`.
- Produces: `POST /telemedicine/rooms` (`@Roles(...PROFISSIONAIS)`, body `{ pacienteId?: string }` → `{ sala, expiraEm }`) e `POST /telemedicine/token` (qualquer autenticado, body `{ sala: string }` → `SessaoVideo`).

- [ ] **Step 1: Escrever os testes que falham** (serviço mockado):
  - `createRoom delega com req.user.email e pacienteId do body`
  - `token delega com sala e req.user`
  - `token sem sala (ou sala não-string, ou com mais de 64 caracteres) lança BadRequestException`
  - `createRoom exige perfis profissionais` (`Reflect.getMetadata(ROLES_KEY, TelemedicineController.prototype.createRoom)` igual a `PROFISSIONAIS`) e `token não tem @Roles`.
- [ ] **Step 2: Rodar e ver falhar** → FAIL.
- [ ] **Step 3: Implementar** controller (validação manual de `body`, como em `auth.controller.ts`) e módulo (`TypeOrmModule.forFeature([TeleRoom])`, controller, provider). Registrar no `AppModule`.
- [ ] **Step 4: `.env.example`** com `PORT`, `DB_*`, `JWT_SECRET`, `CORS_ORIGINS`, `JAAS_APP_ID`, `JAAS_KID`, `JAAS_PRIVATE_KEY` (valores de exemplo vazios, com um comentário sobre `\n`).
- [ ] **Step 5: Rodar todos os specs do módulo:** `npx vitest run src/telemedicine` → PASS; `npx tsc --noEmit -p tsconfig.json` → só o erro antigo de `supertest/types`.
- [ ] **Step 6: Commit** — `feat(telemedicine): endpoints de sala e token`

### Task 4: Serviço do frontend e `SalaVideoTriagem`

**Files:**
- Create: `frontend/src/dados/servicoTelemedicina.ts`
- Modify: `frontend/src/componentes/SalaVideoTriagem.tsx`

**Interfaces:**
- Consumes: `apiFetch`, `ErroApi` de `frontend/src/api.ts`; endpoints da Task 3.
- Produces:
  - `export interface SessaoVideo { provider: 'jaas'; domain: string; appId: string; roomName: string; jwt: string }`
  - `export function criarSala(pacienteId?: string): Promise<{ sala: string; expiraEm: string }>` (POST `/telemedicine/rooms`)
  - `export function obterSessaoVideo(sala: string): Promise<SessaoVideo>` (POST `/telemedicine/token`)
  - `export function mensagemErroVideo(e: unknown): string` (404 → "Sala não encontrada ou expirada.", 403 → "Você não tem acesso a esta sala.", 503 → "Videoconferência indisponível no momento. Avise a equipe.", status 0 → "Sem conexão com o servidor.", demais → "Não foi possível entrar na sala.")
  - `SalaVideoTriagem` com props `{ sala: string; nomeUsuario: string; papel?: 'paciente' | 'profissional'; aoEncerrar: () => void }`; mantém `export function extrairCodigoSala(entrada: string): string`, agora só extraindo `sala=` de uma URL colada (remove o tratamento de domínios Jitsi e do prefixo `TriageAI-`).

- [ ] **Step 1: Criar `servicoTelemedicina.ts`** com as três funções acima.
- [ ] **Step 2: Reescrever `SalaVideoTriagem`.**
  - Primeiro efeito, dependente de `sala`: chama `obterSessaoVideo`; guarda a sessão ou a mensagem de erro; o estado de erro substitui o spinner.
  - Segundo efeito, dependente da sessão: carrega `https://${domain}/${appId}/external_api.js` (reaproveitando `<script>` já existente) e cria `new window.JitsiMeetExternalAPI(domain, { roomName, jwt, parentNode, userInfo, configOverwrite, interfaceConfigOverwrite })`, mantendo as configurações e os botões da barra atuais; limpa no cleanup e chama `aoEncerrar` no evento `readyToClose`.
  - Remover o estado `servidor`, o fallback `ffmuc`/`jitsi`, a barra escura com o seletor e o link `meet.jit.si`. O botão "Abrir em Nova Aba" passa a usar `https://${domain}/${roomName}?jwt=${jwt}` (aparece só quando há sessão).
- [ ] **Step 3: Verificar:** `cd frontend && npx tsc --noEmit` → erros só nos call sites que a Task 5 e a Task 6 ainda vão corrigir (prop `idSala` removida).
- [ ] **Step 4: Commit** — `feat(frontend): sala de vídeo via sessão do backend`

### Task 5: Integração na Área Profissional

**Files:**
- Modify: `frontend/src/paginas/AreaProfissional.tsx` (estado `chamadaAtiva` na linha ~30, botões nas linhas ~395-405 e ~505-520, botão "Abrir Sala" ~530-545, link do paciente ~39-50, uso de `SalaVideoTriagem` ~687)

**Interfaces:**
- Consumes: `criarSala`, `mensagemErroVideo` (Task 4); `SalaVideoTriagem` com prop `sala`.
- Produces: estado `chamadaAtiva: { sala: string; nomePaciente: string } | null`, novo estado `erroSala: string | null`, função `abrirSala(pacienteId: string | undefined, nomePaciente: string): Promise<void>` que chama `criarSala`, define `chamadaAtiva` e guarda o código para o link.

- [ ] **Step 1: Implementar `abrirSala`** e ligar nos três pontos: botão "Entrar em Sala de Vídeo" (usa o `pacienteId` da pré-triagem), botões rápidos por paciente (usam o `pacienteId` de cada pré-triagem; ajustar para não precisar do cast `as any` se o tipo `PreTriagem` já tiver o campo) e "Abrir Sala de Tele-Entrevista Agora" (o campo de texto passa a ser "E-mail do paciente (opcional)": se contiver `@`, vai como `pacienteId`; senão cria sala sem paciente).
- [ ] **Step 2: Link do paciente:** `linkPaciente` passa a usar o código devolvido (`#/entrevista?sala=<codigo>`); antes de abrir uma sala, a caixa mostra "Abra a sala para gerar o link". Mostrar `erroSala` quando `criarSala` falhar.
- [ ] **Step 3: Remover** o `idSalaManual` aleatório `Tele-Gestor-NNNN` e o uso de `extrairCodigoSala` nesse campo.
- [ ] **Step 4: Verificar:** `cd frontend && npx tsc --noEmit` → sem erros em `AreaProfissional.tsx`.
- [ ] **Step 5: Commit** — `feat(frontend): profissional cria sala de vídeo pelo backend`

### Task 6: Integração na Entrevista do paciente

**Files:**
- Modify: `frontend/src/paginas/Entrevista.tsx` (estado de sala ~66-81 e ~1075-1150)

**Interfaces:**
- Consumes: `SalaVideoTriagem` com prop `sala` (Task 4), `extrairCodigoSala`.
- Produces: o paciente só entra por código ou link; sem sala não há vídeo.

- [ ] **Step 1: Ajustar** `idSala` para `salaDigitada.trim() || salaUrl` (sem a "sala pessoal" baseada em `idPaciente`). Remover o botão "Minha Sala Pessoal".
- [ ] **Step 2: Sem sala informada,** mostrar uma mensagem ("Peça ao profissional o link da sala ou cole o código abaixo") e o campo de código (placeholder "Código ou link da sala") em vez de montar `SalaVideoTriagem`; com sala, renderizar `<SalaVideoTriagem sala={idSala} ... />`.
- [ ] **Step 3: Verificar:** `cd frontend && npm run build` → sai com código 0; `npm run lint` → sem novos erros em relação ao estado anterior.
- [ ] **Step 4: Commit** — `feat(frontend): paciente entra na sala por código`

### Task 7: Verificação ponta a ponta e implantação

**Files:**
- Modify: nenhum código; checklist de execução.

- [ ] **Step 1:** Rodar no MySQL (local e Hostinger) o `CREATE TABLE` de `tele_rooms` e configurar `JAAS_APP_ID`, `JAAS_KID` e `JAAS_PRIVATE_KEY` (e `JWT_SECRET` de 32+ caracteres) no `.env` local e no painel da Hostinger.
- [ ] **Step 2:** `cd backend && npm run build && npx vitest run src/telemedicine` → build ok e testes passando.
- [ ] **Step 3: Teste manual com dois navegadores** (profissional e paciente, contas diferentes): profissional abre sala pela pré-triagem → copia o link → paciente logado abre o link → os dois se veem e se ouvem por mais de 5 minutos sem pedido de login; o profissional é moderador e o paciente não.
- [ ] **Step 4: Casos negativos:** outro paciente com o mesmo link para uma sala ligada ao primeiro → mensagem "Você não tem acesso a esta sala."; código inventado → "Sala não encontrada ou expirada."; remover `JAAS_APP_ID` temporariamente → mensagem de indisponibilidade; abrir o link deslogado → após o login, anotar se o código da sala é preservado (comportamento existente de `RotaProtegida`; se perder, registrar como pendência).
- [ ] **Step 5:** Publicar o backend (`dist` rebuildado) e o frontend; repetir o Step 3 em `https://triageia.com`.
