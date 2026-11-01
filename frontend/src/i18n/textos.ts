import type { Modulo, Perfil } from '../auth/tipos'
import type { PassoId } from '../dados/entrevista'
import type { EtapaAtendimento } from '../dados/paciente'
import type { SetorLeito, StatusLeito } from '../dados/tipos'
import type { Consciencia, FatorId } from '../dados/servicoTriagem'

// Use **texto** para negrito.
export type Idioma = 'pt' | 'en' | 'es'
export type NivelManchester = 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul'
export type Modo = 'paciente' | 'profissional'

interface Item { titulo: string; texto: string }
interface TextosLoginPerfil { eyebrow: string; titulo: string; sub: string; campo: string; ph: string; aviso: string }

export interface Textos {
  titulo: string
  nav: { principal: string; sobre: string; empresas: string; idioma: string; paciente: string; profissional: string; contato?: string; chat?: string }
  hero: { titulo: string; beneficios: string[]; iniciar: string }
  sobre: { titulo: string; p1: string; p2: string }
  como: { titulo: string; etapas: Item[] }
  pilares: { titulo: string; itens: Item[] }
  login: {
    voltar: string; abas: string
    senha: string; senhaPh: string; esqueci: string; mostrar: string; ocultar: string
    entrar: string; semConta: string; criar: string
    paciente: TextosLoginPerfil
    profissional: TextosLoginPerfil
    semContaProf: string
    erroRede: string; erroCampos: string; erroEmail: string; carregando: string; verificando: string
    erroCredenciais: string
    mfa: { titulo: string; sub: string; campo: string; ph: string; verificar: string; trocar: string; erro: string }
  }
  area: {
    ola: string; sair: string; emBreve: string; modulosTitulo: string
    perfis: Record<Perfil, string>
    modulos: Record<Modulo, { nome: string; desc: string }>
    paciente: { titulo: string; texto: string }
    negado: { titulo: string; texto: string; voltar: string }
  }
  dashboard: {
    novaTriagem: string; atualizado: string; min: string; excedido: string; erroConexao: string; carregando: string
    fila: { titulo: string; vazio: string }
    leitos: { titulo: string; ocupacao: string; setores: Record<SetorLeito, string>; status: Record<StatusLeito, string> }
    indicadores: { titulo: string; espera: string; ocupacao: string; naFila: string; criticos: string }
    alertas: { titulo: string; sub: string; risco: string; vazio: string }
  }
  triagem: {
    titulo: string; sub: string; voltar: string; secPaciente: string; secSinais: string
    ident: string; idade: string; queixa: string; fc: string; pas: string; pad: string
    fr: string; spo2: string; temp: string; dor: string; consciencia: string
    consc: Record<Consciencia, string>
    sugerir: string; calculando: string; resultado: string; tempoAlvo: string; confianca: string
    fatores: string; semFatores: string; fator: Record<FatorId, string>
    aviso: string; decisao: string; concordo: string; altero: string; novoNivel: string
    justificativa: string; registrar: string; registrado: string; nova: string; simulada: string
    registrando: string; erroSalvar: string
  }
  naoEncontrada: { titulo: string; texto: string; voltar: string }
  areaPaciente: {
    statusTitulo: string; etapas: [string, string, string]
    descricoes: Record<EtapaAtendimento, string>
    cta: string; posicao: string; aFrente: string; minhaVez: string; avisoFila: string
    historicoTitulo: string; historicoVazio: string; alertaTag: string; privacidade: string; confirmaHospital: string
  }
  sobrePagina: {
    eyebrow: string; titulo: string; sub: string
    contextoTitulo: string; contexto: string; solucaoTitulo: string; solucao: string
    tecTitulo: string; tec: Item[]; transpTitulo: string; transp: string
    equipeTitulo: string; orientador: string; curso: string; iniciar: string; saibaMais: string
  }
  entrevista: {
    titulo: string; sub: string; voltar: string; aviso: string; boasVindas: string; digitando: string
    enviar: string; placeholder: string; sim: string; nao: string; escalaRotulo: string; alerta: string
    progresso: string; resumoTitulo: string; resumoSub: string; semAlerta: string; comAlerta: string
    recomecar: string; irArea: string; salvo: string; confirmaHospital: string
    profissionalAviso: string; voltarPainel: string
    ident: { titulo: string; sub: string; email: string; emailPh: string; enviar: string; enviado: string; codigo: string; verificar: string; trocar: string; erroEmail: string; erroCodigo: string; lgpd: string }
    perguntas: Record<PassoId, string>
    rotulos: Record<PassoId, string>
    inicioOpcoes: string[]
  }
  conta: {
    eyebrow: string; titulo: string; sub: string; voltar: string; nome: string; nomePh: string
    campo: string; ph: string; senha: string; confirmar: string; requisitos: string
    req: Record<'tamanho' | 'letra' | 'numero' | 'igual', string>
    termos: string; criar: string; jaTem: string; entrar: string; erro: string
    sucessoTitulo: string; sucessoTexto: string; irLogin: string; carregando: string
  }
  recuperar: {
    eyebrow: string; titulo: string; sub: string; voltar: string; enviar: string
    enviadoTitulo: string; enviado: string; simular: string; erro: string
  }
  redefinir: {
    eyebrow: string; titulo: string; sub: string; nova: string; confirmar: string; salvar: string
    sucessoTitulo: string; sucessoTexto: string; irLogin: string; erro: string
  }
  painel: {
    titulo: string; chegada: string; urgencia: string; simular: string; reiniciar: string
    legenda: string; anos: string
    niveis: Record<NivelManchester, [nome: string, tempo: string]>
    queixas: string[]
  }
}

export const IDIOMAS: { codigo: Idioma; rotulo: string }[] = [
  { codigo: 'pt', rotulo: 'Português (BR)' },
  { codigo: 'en', rotulo: 'English' },
  { codigo: 'es', rotulo: 'Español' },
]

export const textos: Record<Idioma, Textos> = {
  pt: {
    titulo: 'TriageAi — Classificação de risco inteligente',
    nav: { principal: 'Principal', sobre: 'Sobre nós', empresas: 'Para empresas', idioma: 'Idioma', paciente: 'Sou Paciente', profissional: 'Acesso Profissional', contato: 'Contato', chat: 'Chat IA' },
    hero: {
      titulo: 'Classificação de risco inteligente e ágil para o seu atendimento',
      beneficios: ['Analise os seus sintomas', 'Esteja pronto para a consulta', 'Auxílio da IA para uma classificação de risco mais rápida e precisa'],
      iniciar: 'Iniciar entrevista',
    },
    sobre: {
      titulo: 'Sobre o TriageAi',
      p1: 'O TriageAi é um ecossistema inteligente de triagem e gestão hospitalar desenvolvido com o objetivo de otimizar o fluxo de atendimento em prontos-socorros, reduzir tempos de espera e apoiar a tomada de decisão clínica.',
      p2: 'A plataforma conecta pacientes e profissionais de saúde por meio da digitalização do Protocolo de Manchester, combinando inteligência artificial preditiva com critérios clínicos rigorosos para garantir precisão e agilidade em cada etapa do atendimento.',
    },
    como: {
      titulo: 'Como o TriageAi Funciona?',
      etapas: [
        { titulo: 'Pré-Triagem Digital para Pacientes:', texto: 'Por meio de um assistente virtual interativo (Chatbot com IA), o paciente pode descrever seus sintomas antes ou ao chegar ao hospital, agilizando o registro e o início da pré-classificação.' },
        { titulo: 'Classificação de Risco com Inteligência Artificial:', texto: 'Algoritmos avançados de aprendizado de máquina (modelo XGBoost) analisam sintomas e sinais vitais, sugerindo a prioridade de atendimento conforme as 5 cores do Protocolo de Manchester (Vermelho, Laranja, Amarelo, Verde e Azul).' },
        { titulo: 'Inteligência Artificial Explicável (XAI):', texto: 'Para garantir a segurança e a transparência médica, a IA expõe os **principais fatores clínicos (fatores SHAP)** que fundamentaram a sugestão de risco, permitindo que a equipe de enfermagem valide a decisão com total confiança.' },
        { titulo: 'Comando Central & Gestão de Leitos:', texto: 'Um painel em tempo real via WebSockets permite que recepcionistas, enfermeiros e gestores acompanhem a fila de espera reordenada por urgência e controlem a taxa de ocupação dos leitos hospitalares instantaneamente.' },
      ],
    },
    pilares: {
      titulo: 'Nossos Pilares:',
      itens: [
        { titulo: 'Agilidade no Atendimento:', texto: 'Redução do gargalo e do tempo de espera no fluxo inicial do pronto-socorro.' },
        { titulo: 'Segurança e Explicabilidade:', texto: 'Algoritmos transparentes que apoiam — e nunca substituem — o julgamento profissional da equipe de saúde.' },
        { titulo: 'Interoperabilidade & Conformidade:', texto: 'Estruturado com suporte aos padrões internacionais de dados de saúde **(HL7 FHIR R4)** e total adequação à **LGPD**.' },
      ],
    },
    login: {
      erroRede: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', erroCampos: 'Preencha todos os campos.', erroEmail: 'Informe um e-mail válido.', carregando: 'Entrando…', verificando: 'Verificando…',
      semContaProf: 'O acesso de profissionais é liberado pela instituição de saúde.',
      erroCredenciais: 'Não foi possível entrar. Confira seus dados e tente novamente.',
      mfa: { titulo: 'Verificação em duas etapas', sub: 'Digite o código de 6 dígitos do seu aplicativo autenticador.', campo: 'Código de verificação', ph: '000000', verificar: 'Verificar e entrar', trocar: 'Usar outra conta', erro: 'Código inválido ou expirado. Tente novamente.' },
      voltar: 'Voltar ao início', abas: 'Tipo de acesso',
      senha: 'Senha', senhaPh: 'Sua senha', esqueci: 'Esqueci minha senha', mostrar: 'Mostrar senha', ocultar: 'Ocultar senha',
      entrar: 'Entrar com segurança', semConta: 'Ainda não tem uma conta?', criar: 'Criar conta',
      paciente: { eyebrow: 'Área do paciente', titulo: 'Acesse sua conta', sub: 'Entre com seus dados para acompanhar sua triagem e seus atendimentos.', campo: 'E-mail', ph: 'voce@exemplo.com', aviso: 'Seus dados são protegidos e usados somente para identificar seu acesso ao sistema, conforme a LGPD.' },
      profissional: { eyebrow: 'Área profissional', titulo: 'Acesso profissional', sub: 'Entre para gerenciar a fila de atendimento e a ocupação dos leitos.', campo: 'E-mail ou registro profissional', ph: 'voce@hospital.com ou nº do registro', aviso: 'Seu acesso é pessoal e fica registrado para garantir a segurança das informações dos pacientes.' },
    },
    area: {
      ola: 'Olá', sair: 'Sair', emBreve: 'Em breve', modulosTitulo: 'Seus módulos',
      perfis: { recepcionista: 'Recepção', enfermeiro: 'Enfermagem', gestor: 'Gestão', paciente: 'Paciente' },
      modulos: {
        fila: { nome: 'Fila de atendimento', desc: 'Pacientes ordenados por urgência, em tempo real.' },
        triagem: { nome: 'Triagem', desc: 'Classificação de Manchester com a sugestão da IA e seus fatores.' },
        leitos: { nome: 'Leitos', desc: 'Ocupação de enfermaria, UTI e observação.' },
        indicadores: { nome: 'Indicadores', desc: 'Tempo médio de triagem, ocupação e previsão de demanda.' },
      },
      paciente: { titulo: 'Sua área', texto: 'Em breve você poderá acompanhar sua triagem e seus atendimentos por aqui.' },
      negado: { titulo: 'Acesso não autorizado', texto: 'Seu perfil não tem permissão para ver esta página.', voltar: 'Ir para minha área' },
    },
    dashboard: {
      erroConexao: 'Sem conexão com o servidor: os dados abaixo podem estar desatualizados.', carregando: 'Carregando dados…',
      novaTriagem: 'Nova triagem', atualizado: 'Atualizado às', min: 'min', excedido: 'meta excedida',
      fila: { titulo: 'Fila de atendimento', vazio: 'Nenhum paciente aguardando.' },
      leitos: { titulo: 'Mapa de leitos', ocupacao: 'ocupados', setores: { enfermaria: 'Enfermaria', uti: 'UTI', observacao: 'Observação' }, status: { ocupado: 'Ocupado', disponivel: 'Disponível', limpeza: 'Em limpeza', reservado: 'Reservado' } },
      indicadores: { titulo: 'Indicadores', espera: 'Espera média', ocupacao: 'Ocupação de leitos', naFila: 'Pacientes na fila', criticos: 'Vermelhos e laranjas' },
      alertas: { titulo: 'Alertas de deterioração', sub: 'Pacientes com risco de piora acima de 70%.', risco: 'de risco', vazio: 'Nenhum alerta no momento.' },
    },
    triagem: {
      registrando: 'Registrando…', erroSalvar: 'Não foi possível salvar o paciente. Tente novamente.',
      titulo: 'Nova triagem', sub: 'Registre os dados do paciente e os sinais vitais. A IA sugere a classificação; a decisão final é sua.', voltar: 'Voltar ao painel',
      secPaciente: 'Paciente', secSinais: 'Sinais vitais', ident: 'Identificação (iniciais ou prontuário)', idade: 'Idade (anos)', queixa: 'Queixa principal',
      fc: 'Frequência cardíaca (bpm)', pas: 'Pressão sistólica (mmHg)', pad: 'Pressão diastólica (mmHg)', fr: 'Frequência respiratória (irpm)',
      spo2: 'Saturação de O₂ (%)', temp: 'Temperatura (°C)', dor: 'Dor (0 a 10)', consciencia: 'Nível de consciência',
      consc: { alerta: 'Alerta', voz: 'Responde à voz', dor: 'Responde à dor', inconsciente: 'Sem resposta' },
      sugerir: 'Sugerir classificação', calculando: 'Analisando…', resultado: 'Sugestão da IA', tempoAlvo: 'Tempo-alvo', confianca: 'Confiança',
      fatores: 'Principais fatores', semFatores: 'Sinais vitais dentro dos parâmetros esperados.',
      fator: { spo2: 'Saturação de O₂', pa: 'Pressão arterial', fc: 'Frequência cardíaca', fr: 'Frequência respiratória', temp: 'Temperatura', consciencia: 'Consciência', dor: 'Dor' },
      aviso: 'A IA apoia a decisão e não a substitui. Confirme ou altere a classificação.', decisao: 'Sua decisão', concordo: 'Concordo com a sugestão', altero: 'Alterar classificação',
      novoNivel: 'Classificação final', justificativa: 'Justificativa da alteração', registrar: 'Registrar triagem', registrado: 'Triagem registrada com a classificação', nova: 'Nova triagem',
      simulada: 'Demonstração: a sugestão usa regras simples, não o modelo real.',
    },
    naoEncontrada: { titulo: 'Página não encontrada', texto: 'O endereço que você tentou abrir não existe.', voltar: 'Voltar ao início' },
    conta: {
      carregando: 'Cadastrando…',
      eyebrow: 'Cadastro de paciente', titulo: 'Crie sua conta', sub: 'Cadastre-se para acompanhar sua triagem e seus atendimentos.', voltar: 'Voltar ao login',
      nome: 'Nome completo', nomePh: 'Seu nome', campo: 'E-mail', ph: 'voce@exemplo.com', senha: 'Senha', confirmar: 'Confirmar senha',
      requisitos: 'A senha precisa ter:', req: { tamanho: 'No mínimo 8 caracteres', letra: 'Pelo menos uma letra', numero: 'Pelo menos um número', igual: 'Confirmação igual à senha' },
      termos: 'Li e aceito os termos de uso e o tratamento dos meus dados conforme a LGPD.', criar: 'Criar conta', jaTem: 'Já tem uma conta?', entrar: 'Entrar',
      erro: 'Não foi possível criar a conta. Tente novamente.', sucessoTitulo: 'Conta criada!', sucessoTexto: 'Agora você já pode entrar com seus dados.', irLogin: 'Ir para o login',
    },
    recuperar: {
      eyebrow: 'Recuperar acesso', titulo: 'Esqueceu sua senha?', sub: 'Informe seus dados e enviaremos as instruções para criar uma nova senha.', voltar: 'Voltar ao login',
      enviar: 'Enviar instruções', enviadoTitulo: 'Confira seu contato', enviado: 'Se existir uma conta com esses dados, enviamos as instruções para o contato cadastrado.',
      simular: 'Simular abertura do link recebido', erro: 'Não foi possível enviar. Tente novamente.',
    },
    redefinir: {
      eyebrow: 'Nova senha', titulo: 'Crie uma nova senha', sub: 'Escolha uma senha nova para voltar a acessar sua conta.', nova: 'Nova senha', confirmar: 'Confirmar nova senha',
      salvar: 'Salvar nova senha', sucessoTitulo: 'Senha atualizada', sucessoTexto: 'Entre com a sua nova senha.', irLogin: 'Ir para o login', erro: 'Não foi possível atualizar a senha. Tente novamente.',
    },
    sobrePagina: {
      eyebrow: 'Sobre nós', titulo: 'Triagem mais rápida, decisão sempre humana',
      sub: 'O TriageAi é um Trabalho de Conclusão de Curso em Ciência da Computação da UNIP, em Santos, que une inteligência artificial explicável ao Protocolo de Manchester.',
      contextoTitulo: 'Por que criamos o TriageAi',
      contexto: 'A superlotação dos hospitais no Brasil, a triagem ainda feita de forma predominantemente manual nas unidades de urgência e a fragmentação dos sistemas de informação em saúde aumentam a espera de quem mais precisa de cuidado. O projeto nasceu para atacar esses três pontos.',
      solucaoTitulo: 'O que propomos',
      solucao: 'Digitalizamos o Protocolo de Manchester e o combinamos com um modelo preditivo (XGBoost). A IA sugere a classificação de risco e mostra ao enfermeiro os fatores que a embasaram, com IA Explicável (SHAP). A decisão final é sempre do profissional de saúde.',
      tecTitulo: 'Como é construído',
      tec: [
        { titulo: 'Microsserviços', texto: 'Backend em Python/FastAPI, com bancos PostgreSQL e MongoDB.' },
        { titulo: 'Web e mobile', texto: 'Painel web em React e aplicativo em React Native para os sinais vitais à beira-leito.' },
        { titulo: 'Interoperabilidade', texto: 'Integração com sistemas hospitalares pelo padrão HL7 FHIR R4.' },
        { titulo: 'Privacidade e segurança', texto: 'Adequação à LGPD, controle de acesso por perfil e autenticação em duas etapas.' },
      ],
      transpTitulo: 'Transparência',
      transp: 'O modelo foi treinado inicialmente sobre o conjunto de dados público MIMIC-IV, de origem norte-americana, e ainda não passou por validação clínica prospectiva em hospital real. Por isso o TriageAi apoia, e não substitui, a avaliação da equipe de saúde.',
      equipeTitulo: 'Equipe', orientador: 'Orientador', curso: 'Bacharelado em Ciência da Computação — Universidade Paulista (UNIP), Santos, 2026',
      iniciar: 'Experimentar a pré-triagem', saibaMais: 'Conheça nossa história',
    },
    entrevista: {
      titulo: 'Pré-triagem digital', sub: 'Responda a algumas perguntas rápidas sobre seus sintomas. Isso ajuda a equipe a se preparar para o seu atendimento.', voltar: 'Voltar ao início',
      aviso: 'Esta entrevista não é um diagnóstico e não substitui a avaliação da equipe de saúde. Quem confirma seus dados e classifica o risco é a equipe de saúde, no hospital.',
      boasVindas: 'Olá! Sou o assistente do TriageAi. Vou fazer algumas perguntas sobre como você está se sentindo.',
      digitando: 'Assistente digitando', enviar: 'Enviar', placeholder: 'Descreva com suas palavras', sim: 'Sim', nao: 'Não',
      escalaRotulo: 'Escolha de 0 (sem dor) a 10 (dor máxima)',
      alerta: 'Pelo que você informou, seus sintomas podem ser graves. Procure atendimento imediato ou ligue 192 (SAMU, no Brasil) agora, sem esperar o fim da entrevista.',
      progresso: 'Pergunta {n} de {total} · ', resumoTitulo: 'Resumo da sua pré-triagem', resumoSub: 'Estas são as informações que a equipe verá ao iniciar o seu atendimento.',
      semAlerta: 'Você não informou sinais de alerta. Mesmo assim, se piorar, avise a equipe ou procure atendimento.',
      comAlerta: 'Você informou sinais de alerta. Procure atendimento imediato (SAMU 192, no Brasil).',
      recomecar: 'Refazer entrevista', irArea: 'Ir para minha área', salvo: 'Sua pré-triagem foi salva na sua conta.',
      confirmaHospital: 'No hospital, a equipe vai confirmar seus dados (CPF e documento) e fazer a triagem presencial.',
      profissionalAviso: 'Você está conectado como profissional. A pré-triagem é para pacientes.', voltarPainel: 'Voltar ao painel',
      ident: { titulo: 'Antes de começar, confirme seu e-mail', sub: 'Enviamos um código para o seu e-mail. Assim a pré-triagem fica salva na sua conta e a equipe pode encontrá-la quando você chegar ao hospital.', email: 'Seu e-mail', emailPh: 'voce@exemplo.com', enviar: 'Enviar código', enviado: 'Enviamos um código de 6 dígitos para {email}.', codigo: 'Código recebido', verificar: 'Confirmar e começar', trocar: 'Usar outro e-mail', erroEmail: 'Informe um e-mail válido.', erroCodigo: 'Código inválido ou expirado. Tente novamente.', lgpd: 'Pedimos só o e-mail. Seu CPF e documento serão conferidos pela equipe, no hospital.' },
      perguntas: {
        queixa: 'Qual o principal motivo da sua visita?', inicio: 'Há quanto tempo os sintomas começaram?', dor: 'Em uma escala de 0 a 10, qual a intensidade da sua dor?',
        respiracao: 'Você está com dificuldade para respirar?', peito: 'Sente dor forte ou pressão no peito?', febre: 'Teve febre nas últimas 24 horas?', desmaio: 'Teve desmaio, confusão ou dificuldade para acordar?',
      },
      rotulos: { queixa: 'Motivo da visita', inicio: 'Início dos sintomas', dor: 'Dor', respiracao: 'Dificuldade para respirar', peito: 'Dor forte ou pressão no peito', febre: 'Febre', desmaio: 'Desmaio ou confusão' },
      inicioOpcoes: ['Menos de 1 hora', 'Hoje', '1 a 3 dias', 'Mais de 3 dias'],
    },
    areaPaciente: {
      statusTitulo: 'Seu atendimento', etapas: ['Pré-triagem enviada', 'Chegada e triagem presencial', 'Na fila de atendimento'],
      descricoes: {
        nenhuma: 'Você ainda não fez a pré-triagem. Ela adianta o seu atendimento, mas não substitui a triagem presencial.',
        pre_triagem: 'Sua pré-triagem foi enviada. Apresente-se ao hospital: a equipe vai confirmar seus dados e fazer a triagem.',
        chegada: 'Sua chegada foi registrada. Aguarde: um enfermeiro vai chamar você para a triagem.',
        fila: 'Sua triagem foi feita e você está na fila de atendimento.',
      },
      cta: 'Fazer pré-triagem', posicao: 'Você é o {n}º da fila', aFrente: 'Pessoas à sua frente: {n}', minhaVez: 'É a sua vez! Dirija-se ao atendimento.',
      avisoFila: 'A posição pode mudar: casos mais graves passam na frente. Por privacidade, você vê apenas a sua posição.',
      historicoTitulo: 'Suas pré-triagens', historicoVazio: 'Nenhuma pré-triagem ainda.', alertaTag: 'Sinal de alerta',
      privacidade: 'Seus dados são protegidos e usados somente para o seu atendimento, conforme a LGPD.',
      confirmaHospital: 'Seu CPF e documento serão confirmados na recepção e na triagem presencial.',
    },
    painel: {
      titulo: 'Fila de atendimento', chegada: 'Ordem de chegada', urgencia: 'Ordenada por urgência',
      simular: 'Simular nova chegada', reiniciar: 'Reiniciar demonstração', legenda: 'Protocolo de Manchester', anos: 'anos',
      niveis: {
        vermelho: ['Emergência', 'Imediato'], laranja: ['Muito urgente', 'até 10 min'],
        amarelo: ['Urgente', 'até 60 min'], verde: ['Pouco urgente', 'até 120 min'], azul: ['Não urgente', 'até 240 min'],
      },
      queixas: ['Dor de garganta', 'Torção no tornozelo', 'Febre há 3 dias', 'Dor no peito intensa', 'Dor de cabeça leve', 'Falta de ar grave', 'Queda com dor no quadril'],
    },
  },

  en: {
    titulo: 'TriageAi — Smart risk classification',
    nav: { principal: 'Main', sobre: 'About us', empresas: 'For businesses', idioma: 'Language', paciente: "I'm a Patient", profissional: 'Professional Access', contato: 'Contact', chat: 'AI Chat' },
    hero: {
      titulo: 'Smart, fast risk classification for your care',
      beneficios: ['Check your symptoms', 'Arrive ready for your appointment', 'AI support for faster, more accurate risk classification'],
      iniciar: 'Start interview',
    },
    sobre: {
      titulo: 'About TriageAi',
      p1: 'TriageAi is a smart triage and hospital management ecosystem built to streamline patient flow in emergency departments, reduce waiting times and support clinical decision-making.',
      p2: 'The platform connects patients and healthcare professionals by digitizing the Manchester Triage System, combining predictive artificial intelligence with rigorous clinical criteria to ensure accuracy and speed at every step of care.',
    },
    como: {
      titulo: 'How does TriageAi work?',
      etapas: [
        { titulo: 'Digital Pre-Triage for Patients:', texto: 'Through an interactive virtual assistant (AI chatbot), patients can describe their symptoms before or on arrival at the hospital, speeding up registration and the start of pre-classification.' },
        { titulo: 'AI-Powered Risk Classification:', texto: 'Advanced machine learning algorithms (XGBoost model) analyze symptoms and vital signs, suggesting care priority according to the 5 colors of the Manchester Triage System (Red, Orange, Yellow, Green and Blue).' },
        { titulo: 'Explainable AI (XAI):', texto: 'To ensure safety and medical transparency, the AI shows the **main clinical factors (SHAP values)** behind each risk suggestion, so nursing staff can validate the decision with full confidence.' },
        { titulo: 'Command Center & Bed Management:', texto: 'A real-time dashboard using WebSockets lets receptionists, nurses and managers follow the waiting queue reordered by urgency and monitor hospital bed occupancy instantly.' },
      ],
    },
    pilares: {
      titulo: 'Our Pillars:',
      itens: [
        { titulo: 'Faster Care:', texto: 'Less bottleneck and shorter waiting times at the start of the emergency room flow.' },
        { titulo: 'Safety and Explainability:', texto: 'Transparent algorithms that support — and never replace — the professional judgment of the healthcare team.' },
        { titulo: 'Interoperability & Compliance:', texto: 'Built to support international health data standards **(HL7 FHIR R4)** and fully compliant with **LGPD** (Brazil\'s data protection law).' },
      ],
    },
    login: {
      erroRede: 'Could not reach the server. Check your connection and try again.', erroCampos: 'Fill in all fields.', erroEmail: 'Enter a valid email.', carregando: 'Signing in…', verificando: 'Verifying…',
      semContaProf: 'Professional access is provided by your healthcare institution.',
      erroCredenciais: 'Could not sign in. Check your details and try again.',
      mfa: { titulo: 'Two-step verification', sub: 'Enter the 6-digit code from your authenticator app.', campo: 'Verification code', ph: '000000', verificar: 'Verify and sign in', trocar: 'Use another account', erro: 'Invalid or expired code. Try again.' },
      voltar: 'Back to home', abas: 'Access type',
      senha: 'Password', senhaPh: 'Your password', esqueci: 'Forgot my password', mostrar: 'Show password', ocultar: 'Hide password',
      entrar: 'Sign in securely', semConta: "Don't have an account yet?", criar: 'Create account',
      paciente: { eyebrow: 'Patient area', titulo: 'Sign in to your account', sub: 'Enter your details to follow your triage and your visits.', campo: 'Email', ph: 'you@example.com', aviso: 'Your data is protected and used only to identify your access to the system, in line with LGPD.' },
      profissional: { eyebrow: 'Professional area', titulo: 'Professional access', sub: 'Sign in to manage the care queue and bed occupancy.', campo: 'Email or professional ID', ph: 'you@hospital.com or ID number', aviso: 'Your access is personal and logged to keep patient information secure.' },
    },
    area: {
      ola: 'Hello', sair: 'Sign out', emBreve: 'Coming soon', modulosTitulo: 'Your modules',
      perfis: { recepcionista: 'Reception', enfermeiro: 'Nursing', gestor: 'Management', paciente: 'Patient' },
      modulos: {
        fila: { nome: 'Care queue', desc: 'Patients sorted by urgency, in real time.' },
        triagem: { nome: 'Triage', desc: 'Manchester classification with the AI suggestion and its factors.' },
        leitos: { nome: 'Beds', desc: 'Ward, ICU and observation occupancy.' },
        indicadores: { nome: 'Indicators', desc: 'Average triage time, occupancy and demand forecast.' },
      },
      paciente: { titulo: 'Your area', texto: 'Soon you will be able to follow your triage and your visits here.' },
      negado: { titulo: 'Access not authorized', texto: 'Your profile does not have permission to view this page.', voltar: 'Go to my area' },
    },
    dashboard: {
      erroConexao: 'No connection to the server: the data below may be out of date.', carregando: 'Loading data…',
      novaTriagem: 'New triage', atualizado: 'Updated at', min: 'min', excedido: 'target exceeded',
      fila: { titulo: 'Care queue', vazio: 'No patients waiting.' },
      leitos: { titulo: 'Bed map', ocupacao: 'occupied', setores: { enfermaria: 'Ward', uti: 'ICU', observacao: 'Observation' }, status: { ocupado: 'Occupied', disponivel: 'Available', limpeza: 'Being cleaned', reservado: 'Reserved' } },
      indicadores: { titulo: 'Indicators', espera: 'Average wait', ocupacao: 'Bed occupancy', naFila: 'Patients in queue', criticos: 'Reds and oranges' },
      alertas: { titulo: 'Deterioration alerts', sub: 'Patients with a deterioration risk above 70%.', risco: 'risk', vazio: 'No alerts right now.' },
    },
    triagem: {
      registrando: 'Saving…', erroSalvar: 'Could not save the patient. Try again.',
      titulo: 'New triage', sub: 'Record the patient details and vital signs. The AI suggests the classification; the final decision is yours.', voltar: 'Back to dashboard',
      secPaciente: 'Patient', secSinais: 'Vital signs', ident: 'Identification (initials or record no.)', idade: 'Age (years)', queixa: 'Chief complaint',
      fc: 'Heart rate (bpm)', pas: 'Systolic pressure (mmHg)', pad: 'Diastolic pressure (mmHg)', fr: 'Respiratory rate (breaths/min)',
      spo2: 'O₂ saturation (%)', temp: 'Temperature (°C)', dor: 'Pain (0 to 10)', consciencia: 'Level of consciousness',
      consc: { alerta: 'Alert', voz: 'Responds to voice', dor: 'Responds to pain', inconsciente: 'Unresponsive' },
      sugerir: 'Suggest classification', calculando: 'Analyzing…', resultado: 'AI suggestion', tempoAlvo: 'Target time', confianca: 'Confidence',
      fatores: 'Main factors', semFatores: 'Vital signs within expected ranges.',
      fator: { spo2: 'O₂ saturation', pa: 'Blood pressure', fc: 'Heart rate', fr: 'Respiratory rate', temp: 'Temperature', consciencia: 'Consciousness', dor: 'Pain' },
      aviso: 'The AI supports the decision and does not replace it. Confirm or change the classification.', decisao: 'Your decision', concordo: 'I agree with the suggestion', altero: 'Change classification',
      novoNivel: 'Final classification', justificativa: 'Reason for the change', registrar: 'Record triage', registrado: 'Triage recorded with classification', nova: 'New triage',
      simulada: 'Demo: the suggestion uses simple rules, not the real model.',
    },
    naoEncontrada: { titulo: 'Page not found', texto: 'The address you tried to open does not exist.', voltar: 'Back to home' },
    conta: {
      carregando: 'Creating account…',
      eyebrow: 'Patient sign-up', titulo: 'Create your account', sub: 'Sign up to follow your triage and your visits.', voltar: 'Back to sign in',
      nome: 'Full name', nomePh: 'Your name', campo: 'Email', ph: 'you@example.com', senha: 'Password', confirmar: 'Confirm password',
      requisitos: 'Your password must have:', req: { tamanho: 'At least 8 characters', letra: 'At least one letter', numero: 'At least one number', igual: 'Confirmation matches the password' },
      termos: 'I have read and accept the terms of use and the processing of my data under LGPD.', criar: 'Create account', jaTem: 'Already have an account?', entrar: 'Sign in',
      erro: 'Could not create the account. Try again.', sucessoTitulo: 'Account created!', sucessoTexto: 'You can now sign in with your details.', irLogin: 'Go to sign in',
    },
    recuperar: {
      eyebrow: 'Recover access', titulo: 'Forgot your password?', sub: 'Enter your details and we will send instructions to create a new password.', voltar: 'Back to sign in',
      enviar: 'Send instructions', enviadoTitulo: 'Check your contact', enviado: 'If an account exists with these details, we sent the instructions to the registered contact.',
      simular: 'Simulate opening the received link', erro: 'Could not send. Try again.',
    },
    redefinir: {
      eyebrow: 'New password', titulo: 'Create a new password', sub: 'Choose a new password to access your account again.', nova: 'New password', confirmar: 'Confirm new password',
      salvar: 'Save new password', sucessoTitulo: 'Password updated', sucessoTexto: 'Sign in with your new password.', irLogin: 'Go to sign in', erro: 'Could not update the password. Try again.',
    },
    sobrePagina: {
      eyebrow: 'About us', titulo: 'Faster triage, always a human decision',
      sub: 'TriageAi is a computer science capstone project from UNIP, in Santos (Brazil), that brings explainable artificial intelligence to the Manchester Triage System.',
      contextoTitulo: 'Why we built TriageAi',
      contexto: 'Overcrowded hospitals in Brazil, triage that is still mostly manual in emergency units and fragmented health information systems all increase the wait for those who need care the most. The project was born to tackle these three problems.',
      solucaoTitulo: 'What we propose',
      solucao: 'We digitized the Manchester Triage System and combined it with a predictive model (XGBoost). The AI suggests the risk classification and shows the nurse the factors behind it, using Explainable AI (SHAP). The final decision always belongs to the healthcare professional.',
      tecTitulo: 'How it is built',
      tec: [
        { titulo: 'Microservices', texto: 'Python/FastAPI backend with PostgreSQL and MongoDB databases.' },
        { titulo: 'Web and mobile', texto: 'A React web dashboard and a React Native app for bedside vital signs.' },
        { titulo: 'Interoperability', texto: 'Integration with hospital systems through the HL7 FHIR R4 standard.' },
        { titulo: 'Privacy and security', texto: 'LGPD compliance (Brazil\'s data protection law), role-based access control and two-step authentication.' },
      ],
      transpTitulo: 'Transparency',
      transp: 'The model was initially trained on the public MIMIC-IV dataset, which comes from the United States, and has not yet undergone prospective clinical validation in a real hospital. That is why TriageAi supports, and never replaces, the assessment of the healthcare team.',
      equipeTitulo: 'Team', orientador: 'Advisor', curso: 'Bachelor of Computer Science — Universidade Paulista (UNIP), Santos, 2026',
      iniciar: 'Try the pre-triage', saibaMais: 'Learn our story',
    },
    entrevista: {
      titulo: 'Digital pre-triage', sub: 'Answer a few quick questions about your symptoms. This helps the team get ready for your visit.', voltar: 'Back to home',
      aviso: 'This interview is not a diagnosis and does not replace the assessment of the healthcare team. The healthcare team confirms your details and classifies the risk at the hospital.',
      boasVindas: 'Hello! I am the TriageAi assistant. I will ask a few questions about how you are feeling.',
      digitando: 'Assistant typing', enviar: 'Send', placeholder: 'Describe in your own words', sim: 'Yes', nao: 'No',
      escalaRotulo: 'Choose from 0 (no pain) to 10 (worst pain)',
      alerta: 'Based on what you reported, your symptoms may be serious. Seek immediate care or call your local emergency number now (192, SAMU, in Brazil), without waiting for the interview to end.',
      progresso: 'Question {n} of {total} · ', resumoTitulo: 'Your pre-triage summary', resumoSub: 'This is the information the team will see when your visit begins.',
      semAlerta: 'You did not report warning signs. Even so, if you get worse, tell the team or seek care.',
      comAlerta: 'You reported warning signs. Seek immediate care (SAMU 192, in Brazil).',
      recomecar: 'Redo interview', irArea: 'Go to my area', salvo: 'Your pre-triage was saved to your account.',
      confirmaHospital: 'At the hospital, the team will confirm your details (ID and document) and do the in-person triage.',
      profissionalAviso: 'You are signed in as a professional. Pre-triage is for patients.', voltarPainel: 'Back to dashboard',
      ident: { titulo: 'Before you start, confirm your email', sub: 'We send a code to your email. That way the pre-triage is saved to your account and the team can find it when you arrive at the hospital.', email: 'Your email', emailPh: 'you@example.com', enviar: 'Send code', enviado: 'We sent a 6-digit code to {email}.', codigo: 'Code received', verificar: 'Confirm and start', trocar: 'Use another email', erroEmail: 'Enter a valid email.', erroCodigo: 'Invalid or expired code. Try again.', lgpd: 'We only ask for your email. Your CPF and document will be checked by the team at the hospital.' },
      perguntas: {
        queixa: 'What is the main reason for your visit?', inicio: 'How long ago did the symptoms start?', dor: 'On a scale from 0 to 10, how intense is your pain?',
        respiracao: 'Are you having trouble breathing?', peito: 'Do you feel severe chest pain or pressure?', febre: 'Have you had a fever in the last 24 hours?', desmaio: 'Have you fainted, felt confused or had trouble waking up?',
      },
      rotulos: { queixa: 'Reason for visit', inicio: 'Symptom onset', dor: 'Pain', respiracao: 'Trouble breathing', peito: 'Severe chest pain or pressure', febre: 'Fever', desmaio: 'Fainting or confusion' },
      inicioOpcoes: ['Less than 1 hour', 'Today', '1 to 3 days', 'More than 3 days'],
    },
    areaPaciente: {
      statusTitulo: 'Your visit', etapas: ['Pre-triage sent', 'Arrival and in-person triage', 'In the care queue'],
      descricoes: {
        nenhuma: 'You have not done the pre-triage yet. It speeds up your visit but does not replace the in-person triage.',
        pre_triagem: 'Your pre-triage was sent. Go to the hospital: the team will confirm your details and do the triage.',
        chegada: 'Your arrival was recorded. Please wait: a nurse will call you for the triage.',
        fila: 'Your triage is done and you are in the care queue.',
      },
      cta: 'Do the pre-triage', posicao: 'You are number {n} in the queue', aFrente: 'People ahead of you: {n}', minhaVez: 'It is your turn! Please go to the care area.',
      avisoFila: 'Your position can change: more serious cases go first. For privacy, you only see your own position.',
      historicoTitulo: 'Your pre-triages', historicoVazio: 'No pre-triage yet.', alertaTag: 'Warning sign',
      privacidade: 'Your data is protected and used only for your care, in line with LGPD.',
      confirmaHospital: 'Your ID and document will be confirmed at reception and at the in-person triage.',
    },
    painel: {
      titulo: 'Care queue', chegada: 'Arrival order', urgencia: 'Sorted by urgency',
      simular: 'Simulate new arrival', reiniciar: 'Restart demo', legenda: 'Manchester Triage System', anos: 'years old',
      niveis: {
        vermelho: ['Immediate', 'Immediate'], laranja: ['Very urgent', 'within 10 min'],
        amarelo: ['Urgent', 'within 60 min'], verde: ['Standard', 'within 120 min'], azul: ['Non-urgent', 'within 240 min'],
      },
      queixas: ['Sore throat', 'Twisted ankle', 'Fever for 3 days', 'Severe chest pain', 'Mild headache', 'Severe shortness of breath', 'Fall with hip pain'],
    },
  },

  es: {
    titulo: 'TriageAi — Clasificación de riesgo inteligente',
    nav: { principal: 'Principal', sobre: 'Sobre nosotros', empresas: 'Para empresas', idioma: 'Idioma', paciente: 'Soy Paciente', profissional: 'Acceso Profesional', contato: 'Contacto', chat: 'Chat IA' },
    hero: {
      titulo: 'Clasificación de riesgo inteligente y ágil para su atención',
      beneficios: ['Analice sus síntomas', 'Llegue listo para la consulta', 'Apoyo de la IA para una clasificación de riesgo más rápida y precisa'],
      iniciar: 'Iniciar entrevista',
    },
    sobre: {
      titulo: 'Sobre TriageAi',
      p1: 'TriageAi es un ecosistema inteligente de triaje y gestión hospitalaria desarrollado para optimizar el flujo de atención en urgencias, reducir los tiempos de espera y apoyar la toma de decisiones clínicas.',
      p2: 'La plataforma conecta a pacientes y profesionales de la salud mediante la digitalización del Protocolo de Manchester, combinando inteligencia artificial predictiva con criterios clínicos rigurosos para garantizar precisión y agilidad en cada etapa de la atención.',
    },
    como: {
      titulo: '¿Cómo funciona TriageAi?',
      etapas: [
        { titulo: 'Pretriaje Digital para Pacientes:', texto: 'Mediante un asistente virtual interactivo (chatbot con IA), el paciente puede describir sus síntomas antes o al llegar al hospital, agilizando el registro y el inicio de la preclasificación.' },
        { titulo: 'Clasificación de Riesgo con Inteligencia Artificial:', texto: 'Algoritmos avanzados de aprendizaje automático (modelo XGBoost) analizan síntomas y signos vitales, sugiriendo la prioridad de atención según los 5 colores del Protocolo de Manchester (Rojo, Naranja, Amarillo, Verde y Azul).' },
        { titulo: 'Inteligencia Artificial Explicable (XAI):', texto: 'Para garantizar la seguridad y la transparencia médica, la IA muestra los **principales factores clínicos (valores SHAP)** que sustentan la sugerencia de riesgo, permitiendo que el equipo de enfermería valide la decisión con total confianza.' },
        { titulo: 'Centro de Mando y Gestión de Camas:', texto: 'Un panel en tiempo real mediante WebSockets permite que recepcionistas, enfermeros y gestores sigan la fila de espera reordenada por urgencia y controlen al instante la ocupación de las camas hospitalarias.' },
      ],
    },
    pilares: {
      titulo: 'Nuestros Pilares:',
      itens: [
        { titulo: 'Agilidad en la Atención:', texto: 'Reducción del cuello de botella y del tiempo de espera en el flujo inicial de urgencias.' },
        { titulo: 'Seguridad y Explicabilidad:', texto: 'Algoritmos transparentes que apoyan — y nunca sustituyen — el criterio profesional del equipo de salud.' },
        { titulo: 'Interoperabilidad y Cumplimiento:', texto: 'Estructurado con soporte para los estándares internacionales de datos de salud **(HL7 FHIR R4)** y total adecuación a la **LGPD** (ley de protección de datos de Brasil).' },
      ],
    },
    login: {
      erroRede: 'No fue posible conectar con el servidor. Revise su conexión e intente de nuevo.', erroCampos: 'Complete todos los campos.', erroEmail: 'Ingrese un correo válido.', carregando: 'Ingresando…', verificando: 'Verificando…',
      semContaProf: 'El acceso de profesionales lo proporciona la institución de salud.',
      erroCredenciais: 'No fue posible ingresar. Revise sus datos e intente de nuevo.',
      mfa: { titulo: 'Verificación en dos pasos', sub: 'Ingrese el código de 6 dígitos de su aplicación de autenticación.', campo: 'Código de verificación', ph: '000000', verificar: 'Verificar e ingresar', trocar: 'Usar otra cuenta', erro: 'Código inválido o vencido. Intente de nuevo.' },
      voltar: 'Volver al inicio', abas: 'Tipo de acceso',
      senha: 'Contraseña', senhaPh: 'Su contraseña', esqueci: 'Olvidé mi contraseña', mostrar: 'Mostrar contraseña', ocultar: 'Ocultar contraseña',
      entrar: 'Entrar de forma segura', semConta: '¿Aún no tiene una cuenta?', criar: 'Crear cuenta',
      paciente: { eyebrow: 'Área del paciente', titulo: 'Acceda a su cuenta', sub: 'Ingrese sus datos para seguir su triaje y sus atenciones.', campo: 'Correo electrónico', ph: 'usted@ejemplo.com', aviso: 'Sus datos están protegidos y se usan solo para identificar su acceso al sistema, conforme a la LGPD.' },
      profissional: { eyebrow: 'Área profesional', titulo: 'Acceso profesional', sub: 'Ingrese para gestionar la fila de atención y la ocupación de camas.', campo: 'Correo o registro profesional', ph: 'usted@hospital.com o n.º de registro', aviso: 'Su acceso es personal y queda registrado para garantizar la seguridad de la información de los pacientes.' },
    },
    area: {
      ola: 'Hola', sair: 'Salir', emBreve: 'Próximamente', modulosTitulo: 'Sus módulos',
      perfis: { recepcionista: 'Recepción', enfermeiro: 'Enfermería', gestor: 'Gestión', paciente: 'Paciente' },
      modulos: {
        fila: { nome: 'Fila de atención', desc: 'Pacientes ordenados por urgencia, en tiempo real.' },
        triagem: { nome: 'Triaje', desc: 'Clasificación de Manchester con la sugerencia de la IA y sus factores.' },
        leitos: { nome: 'Camas', desc: 'Ocupación de sala, UCI y observación.' },
        indicadores: { nome: 'Indicadores', desc: 'Tiempo medio de triaje, ocupación y previsión de demanda.' },
      },
      paciente: { titulo: 'Su área', texto: 'Pronto podrá seguir su triaje y sus atenciones aquí.' },
      negado: { titulo: 'Acceso no autorizado', texto: 'Su perfil no tiene permiso para ver esta página.', voltar: 'Ir a mi área' },
    },
    dashboard: {
      erroConexao: 'Sin conexión con el servidor: los datos siguientes pueden estar desactualizados.', carregando: 'Cargando datos…',
      novaTriagem: 'Nuevo triaje', atualizado: 'Actualizado a las', min: 'min', excedido: 'meta superada',
      fila: { titulo: 'Fila de atención', vazio: 'Ningún paciente esperando.' },
      leitos: { titulo: 'Mapa de camas', ocupacao: 'ocupadas', setores: { enfermaria: 'Sala', uti: 'UCI', observacao: 'Observación' }, status: { ocupado: 'Ocupada', disponivel: 'Disponible', limpeza: 'En limpieza', reservado: 'Reservada' } },
      indicadores: { titulo: 'Indicadores', espera: 'Espera media', ocupacao: 'Ocupación de camas', naFila: 'Pacientes en fila', criticos: 'Rojos y naranjas' },
      alertas: { titulo: 'Alertas de deterioro', sub: 'Pacientes con riesgo de empeorar superior al 70%.', risco: 'de riesgo', vazio: 'Ninguna alerta por ahora.' },
    },
    triagem: {
      registrando: 'Guardando…', erroSalvar: 'No fue posible guardar al paciente. Intente de nuevo.',
      titulo: 'Nuevo triaje', sub: 'Registre los datos del paciente y los signos vitales. La IA sugiere la clasificación; la decisión final es suya.', voltar: 'Volver al panel',
      secPaciente: 'Paciente', secSinais: 'Signos vitales', ident: 'Identificación (iniciales o historia clínica)', idade: 'Edad (años)', queixa: 'Motivo de consulta',
      fc: 'Frecuencia cardíaca (lpm)', pas: 'Presión sistólica (mmHg)', pad: 'Presión diastólica (mmHg)', fr: 'Frecuencia respiratoria (rpm)',
      spo2: 'Saturación de O₂ (%)', temp: 'Temperatura (°C)', dor: 'Dolor (0 a 10)', consciencia: 'Nivel de conciencia',
      consc: { alerta: 'Alerta', voz: 'Responde a la voz', dor: 'Responde al dolor', inconsciente: 'Sin respuesta' },
      sugerir: 'Sugerir clasificación', calculando: 'Analizando…', resultado: 'Sugerencia de la IA', tempoAlvo: 'Tiempo objetivo', confianca: 'Confianza',
      fatores: 'Factores principales', semFatores: 'Signos vitales dentro de los parámetros esperados.',
      fator: { spo2: 'Saturación de O₂', pa: 'Presión arterial', fc: 'Frecuencia cardíaca', fr: 'Frecuencia respiratoria', temp: 'Temperatura', consciencia: 'Conciencia', dor: 'Dolor' },
      aviso: 'La IA apoya la decisión y no la sustituye. Confirme o cambie la clasificación.', decisao: 'Su decisión', concordo: 'Estoy de acuerdo con la sugerencia', altero: 'Cambiar clasificación',
      novoNivel: 'Clasificación final', justificativa: 'Justificación del cambio', registrar: 'Registrar triaje', registrado: 'Triaje registrado con la clasificación', nova: 'Nuevo triaje',
      simulada: 'Demostración: la sugerencia usa reglas simples, no el modelo real.',
    },
    naoEncontrada: { titulo: 'Página no encontrada', texto: 'La dirección que intentó abrir no existe.', voltar: 'Volver al inicio' },
    conta: {
      carregando: 'Creando cuenta…',
      eyebrow: 'Registro de paciente', titulo: 'Cree su cuenta', sub: 'Regístrese para seguir su triaje y sus atenciones.', voltar: 'Volver al inicio de sesión',
      nome: 'Nombre completo', nomePh: 'Su nombre', campo: 'Correo electrónico', ph: 'usted@ejemplo.com', senha: 'Contraseña', confirmar: 'Confirmar contraseña',
      requisitos: 'La contraseña debe tener:', req: { tamanho: 'Al menos 8 caracteres', letra: 'Al menos una letra', numero: 'Al menos un número', igual: 'La confirmación coincide con la contraseña' },
      termos: 'He leído y acepto los términos de uso y el tratamiento de mis datos según la LGPD.', criar: 'Crear cuenta', jaTem: '¿Ya tiene una cuenta?', entrar: 'Ingresar',
      erro: 'No fue posible crear la cuenta. Intente de nuevo.', sucessoTitulo: '¡Cuenta creada!', sucessoTexto: 'Ya puede ingresar con sus datos.', irLogin: 'Ir al inicio de sesión',
    },
    recuperar: {
      eyebrow: 'Recuperar acceso', titulo: '¿Olvidó su contraseña?', sub: 'Ingrese sus datos y le enviaremos las instrucciones para crear una nueva contraseña.', voltar: 'Volver al inicio de sesión',
      enviar: 'Enviar instrucciones', enviadoTitulo: 'Revise su contacto', enviado: 'Si existe una cuenta con estos datos, enviamos las instrucciones al contacto registrado.',
      simular: 'Simular la apertura del enlace recibido', erro: 'No fue posible enviar. Intente de nuevo.',
    },
    redefinir: {
      eyebrow: 'Nueva contraseña', titulo: 'Cree una nueva contraseña', sub: 'Elija una nueva contraseña para volver a acceder a su cuenta.', nova: 'Nueva contraseña', confirmar: 'Confirmar nueva contraseña',
      salvar: 'Guardar nueva contraseña', sucessoTitulo: 'Contraseña actualizada', sucessoTexto: 'Ingrese con su nueva contraseña.', irLogin: 'Ir al inicio de sesión', erro: 'No fue posible actualizar la contraseña. Intente de nuevo.',
    },
    sobrePagina: {
      eyebrow: 'Sobre nosotros', titulo: 'Triaje más rápido, decisión siempre humana',
      sub: 'TriageAi es un trabajo de fin de carrera en Ciencias de la Computación de la UNIP, en Santos (Brasil), que une la inteligencia artificial explicable al Protocolo de Manchester.',
      contextoTitulo: 'Por qué creamos TriageAi',
      contexto: 'La saturación de los hospitales en Brasil, el triaje que aún es mayormente manual en las unidades de urgencias y la fragmentación de los sistemas de información en salud aumentan la espera de quienes más necesitan atención. El proyecto nació para abordar estos tres puntos.',
      solucaoTitulo: 'Qué proponemos',
      solucao: 'Digitalizamos el Protocolo de Manchester y lo combinamos con un modelo predictivo (XGBoost). La IA sugiere la clasificación de riesgo y muestra al enfermero los factores que la sustentan, con IA Explicable (SHAP). La decisión final es siempre del profesional de salud.',
      tecTitulo: 'Cómo está construido',
      tec: [
        { titulo: 'Microservicios', texto: 'Backend en Python/FastAPI, con bases de datos PostgreSQL y MongoDB.' },
        { titulo: 'Web y móvil', texto: 'Panel web en React y aplicación en React Native para los signos vitales junto a la cama.' },
        { titulo: 'Interoperabilidad', texto: 'Integración con sistemas hospitalarios mediante el estándar HL7 FHIR R4.' },
        { titulo: 'Privacidad y seguridad', texto: 'Adecuación a la LGPD (ley de protección de datos de Brasil), control de acceso por perfil y autenticación en dos pasos.' },
      ],
      transpTitulo: 'Transparencia',
      transp: 'El modelo se entrenó inicialmente con el conjunto de datos público MIMIC-IV, de origen estadounidense, y aún no ha pasado por una validación clínica prospectiva en un hospital real. Por eso TriageAi apoya, y no sustituye, la evaluación del equipo de salud.',
      equipeTitulo: 'Equipo', orientador: 'Orientador', curso: 'Licenciatura en Ciencias de la Computación — Universidade Paulista (UNIP), Santos, 2026',
      iniciar: 'Probar el pretriaje', saibaMais: 'Conozca nuestra historia',
    },
    entrevista: {
      titulo: 'Pretriaje digital', sub: 'Responda unas preguntas rápidas sobre sus síntomas. Esto ayuda al equipo a prepararse para su atención.', voltar: 'Volver al inicio',
      aviso: 'Esta entrevista no es un diagnóstico y no sustituye la evaluación del equipo de salud. Quien confirma sus datos y clasifica el riesgo es el equipo de salud, en el hospital.',
      boasVindas: '¡Hola! Soy el asistente de TriageAi. Le haré algunas preguntas sobre cómo se siente.',
      digitando: 'Asistente escribiendo', enviar: 'Enviar', placeholder: 'Describa con sus palabras', sim: 'Sí', nao: 'No',
      escalaRotulo: 'Elija de 0 (sin dolor) a 10 (dolor máximo)',
      alerta: 'Según lo que informó, sus síntomas pueden ser graves. Busque atención inmediata o llame ahora al número de emergencias de su país (192, SAMU, en Brasil), sin esperar el final de la entrevista.',
      progresso: 'Pregunta {n} de {total} · ', resumoTitulo: 'Resumen de su pretriaje', resumoSub: 'Esta es la información que el equipo verá al iniciar su atención.',
      semAlerta: 'No informó señales de alarma. Aun así, si empeora, avise al equipo o busque atención.',
      comAlerta: 'Informó señales de alarma. Busque atención inmediata (SAMU 192, en Brasil).',
      recomecar: 'Rehacer entrevista', irArea: 'Ir a mi área', salvo: 'Su pretriaje se guardó en su cuenta.',
      confirmaHospital: 'En el hospital, el equipo confirmará sus datos (documento) y hará el triaje presencial.',
      profissionalAviso: 'Está conectado como profesional. El pretriaje es para pacientes.', voltarPainel: 'Volver al panel',
      ident: { titulo: 'Antes de empezar, confirme su correo', sub: 'Enviamos un código a su correo. Así el pretriaje queda guardado en su cuenta y el equipo puede encontrarlo cuando llegue al hospital.', email: 'Su correo', emailPh: 'usted@ejemplo.com', enviar: 'Enviar código', enviado: 'Enviamos un código de 6 dígitos a {email}.', codigo: 'Código recibido', verificar: 'Confirmar y empezar', trocar: 'Usar otro correo', erroEmail: 'Ingrese un correo válido.', erroCodigo: 'Código inválido o vencido. Intente de nuevo.', lgpd: 'Solo pedimos el correo. Su CPF y documento serán verificados por el equipo en el hospital.' },
      perguntas: {
        queixa: '¿Cuál es el motivo principal de su consulta?', inicio: '¿Hace cuánto empezaron los síntomas?', dor: 'En una escala de 0 a 10, ¿qué tan intenso es su dolor?',
        respiracao: '¿Tiene dificultad para respirar?', peito: '¿Siente dolor fuerte o presión en el pecho?', febre: '¿Tuvo fiebre en las últimas 24 horas?', desmaio: '¿Tuvo desmayo, confusión o dificultad para despertar?',
      },
      rotulos: { queixa: 'Motivo de consulta', inicio: 'Inicio de los síntomas', dor: 'Dolor', respiracao: 'Dificultad para respirar', peito: 'Dolor fuerte o presión en el pecho', febre: 'Fiebre', desmaio: 'Desmayo o confusión' },
      inicioOpcoes: ['Menos de 1 hora', 'Hoy', '1 a 3 días', 'Más de 3 días'],
    },
    areaPaciente: {
      statusTitulo: 'Su atención', etapas: ['Pretriaje enviado', 'Llegada y triaje presencial', 'En la fila de atención'],
      descricoes: {
        nenhuma: 'Aún no hizo el pretriaje. Agiliza su atención, pero no sustituye el triaje presencial.',
        pre_triagem: 'Su pretriaje fue enviado. Preséntese en el hospital: el equipo confirmará sus datos y hará el triaje.',
        chegada: 'Su llegada fue registrada. Espere: un enfermero lo llamará para el triaje.',
        fila: 'Su triaje está hecho y está en la fila de atención.',
      },
      cta: 'Hacer el pretriaje', posicao: 'Usted es el n.º {n} de la fila', aFrente: 'Personas delante de usted: {n}', minhaVez: '¡Es su turno! Diríjase a la atención.',
      avisoFila: 'La posición puede cambiar: los casos más graves pasan primero. Por privacidad, solo ve su propia posición.',
      historicoTitulo: 'Sus pretriajes', historicoVazio: 'Aún no hay pretriajes.', alertaTag: 'Señal de alarma',
      privacidade: 'Sus datos están protegidos y se usan solo para su atención, conforme a la LGPD.',
      confirmaHospital: 'Su CPF y documento se confirmarán en recepción y en el triaje presencial.',
    },
    painel: {
      titulo: 'Fila de atención', chegada: 'Orden de llegada', urgencia: 'Ordenada por urgencia',
      simular: 'Simular nueva llegada', reiniciar: 'Reiniciar demostración', legenda: 'Protocolo de Manchester', anos: 'años',
      niveis: {
        vermelho: ['Emergencia', 'Inmediato'], laranja: ['Muy urgente', 'hasta 10 min'],
        amarelo: ['Urgente', 'hasta 60 min'], verde: ['Poco urgente', 'hasta 120 min'], azul: ['No urgente', 'hasta 240 min'],
      },
      queixas: ['Dolor de garganta', 'Torcedura de tobillo', 'Fiebre desde hace 3 días', 'Dolor de pecho intenso', 'Dolor de cabeza leve', 'Dificultad grave para respirar', 'Caída con dolor de cadera'],
    },
  },
}
