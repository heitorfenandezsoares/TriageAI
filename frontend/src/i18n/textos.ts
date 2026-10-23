import type { Modulo, Perfil } from '../auth/tipos'
import type { SetorLeito, StatusLeito } from '../dados/tipos'
import type { Consciencia, FatorId } from '../dados/servicoTriagem'

export type Idioma = 'pt' | 'en' | 'es'
export type NivelManchester = 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul'
export type Modo = 'paciente' | 'profissional'

interface Item { titulo: string; texto: string }
interface TextosLoginPerfil { eyebrow: string; titulo: string; sub: string; campo: string; ph: string; aviso: string }

export interface Textos {
  titulo: string
  nav: { principal: string; sobre: string; empresas: string; idioma: string; paciente: string; profissional: string }
  hero: { titulo: string; beneficios: string[]; iniciar: string }
  sobre: { titulo: string; p1: string; p2: string }
  como: { titulo: string; etapas: Item[] }
  pilares: { titulo: string; itens: Item[] }
  login: {
    voltar: string; abas: string; abaPaciente: string; abaProf: string
    senha: string; senhaPh: string; esqueci: string; mostrar: string; ocultar: string
    entrar: string; semConta: string; criar: string
    paciente: TextosLoginPerfil
    profissional: TextosLoginPerfil
    semContaProf: string
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
    novaTriagem: string; atualizado: string; min: string; excedido: string
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
  }
  naoEncontrada: { titulo: string; texto: string; voltar: string }
  conta: {
    eyebrow: string; titulo: string; sub: string; voltar: string; nome: string; nomePh: string
    campo: string; ph: string; senha: string; confirmar: string; requisitos: string
    req: Record<'tamanho' | 'letra' | 'numero' | 'igual', string>
    termos: string; criar: string; jaTem: string; entrar: string; erro: string
    sucessoTitulo: string; sucessoTexto: string; irLogin: string
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
    nav: { principal: 'Principal', sobre: 'Sobre nós', empresas: 'Para empresas', idioma: 'Idioma', paciente: 'Sou Paciente', profissional: 'Acesso Profissional' },
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
      semContaProf: 'O acesso de profissionais é liberado pela instituição de saúde.',
      erroCredenciais: 'Não foi possível entrar. Confira seus dados e tente novamente.',
      mfa: { titulo: 'Verificação em duas etapas', sub: 'Digite o código de 6 dígitos do seu aplicativo autenticador.', campo: 'Código de verificação', ph: '000000', verificar: 'Verificar e entrar', trocar: 'Usar outra conta', erro: 'Código inválido ou expirado. Tente novamente.' },
      voltar: 'Voltar ao início', abas: 'Tipo de acesso', abaPaciente: 'Paciente', abaProf: 'Profissional',
      senha: 'Senha', senhaPh: 'Sua senha', esqueci: 'Esqueci minha senha', mostrar: 'Mostrar senha', ocultar: 'Ocultar senha',
      entrar: 'Entrar com segurança', semConta: 'Ainda não tem uma conta?', criar: 'Criar conta',
      paciente: { eyebrow: 'Área do paciente', titulo: 'Acesse sua conta', sub: 'Entre com seus dados para acompanhar sua triagem e seus atendimentos.', campo: 'CPF ou e-mail', ph: '000.000.000-00 ou voce@exemplo.com', aviso: 'Seus dados são protegidos e usados somente para identificar seu acesso ao sistema, conforme a LGPD.' },
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
      novaTriagem: 'Nova triagem', atualizado: 'Atualizado às', min: 'min', excedido: 'meta excedida',
      fila: { titulo: 'Fila de atendimento', vazio: 'Nenhum paciente aguardando.' },
      leitos: { titulo: 'Mapa de leitos', ocupacao: 'ocupados', setores: { enfermaria: 'Enfermaria', uti: 'UTI', observacao: 'Observação' }, status: { ocupado: 'Ocupado', disponivel: 'Disponível', limpeza: 'Em limpeza', reservado: 'Reservado' } },
      indicadores: { titulo: 'Indicadores', espera: 'Espera média', ocupacao: 'Ocupação de leitos', naFila: 'Pacientes na fila', criticos: 'Vermelhos e laranjas' },
      alertas: { titulo: 'Alertas de deterioração', sub: 'Pacientes com risco de piora acima de 70%.', risco: 'de risco', vazio: 'Nenhum alerta no momento.' },
    },
    triagem: {
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
      eyebrow: 'Cadastro de paciente', titulo: 'Crie sua conta', sub: 'Cadastre-se para acompanhar sua triagem e seus atendimentos.', voltar: 'Voltar ao login',
      nome: 'Nome completo', nomePh: 'Seu nome', campo: 'CPF ou e-mail', ph: '000.000.000-00 ou voce@exemplo.com', senha: 'Senha', confirmar: 'Confirmar senha',
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
    nav: { principal: 'Main', sobre: 'About us', empresas: 'For businesses', idioma: 'Language', paciente: "I'm a Patient", profissional: 'Professional Access' },
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
      semContaProf: 'Professional access is provided by your healthcare institution.',
      erroCredenciais: 'Could not sign in. Check your details and try again.',
      mfa: { titulo: 'Two-step verification', sub: 'Enter the 6-digit code from your authenticator app.', campo: 'Verification code', ph: '000000', verificar: 'Verify and sign in', trocar: 'Use another account', erro: 'Invalid or expired code. Try again.' },
      voltar: 'Back to home', abas: 'Access type', abaPaciente: 'Patient', abaProf: 'Professional',
      senha: 'Password', senhaPh: 'Your password', esqueci: 'Forgot my password', mostrar: 'Show password', ocultar: 'Hide password',
      entrar: 'Sign in securely', semConta: "Don't have an account yet?", criar: 'Create account',
      paciente: { eyebrow: 'Patient area', titulo: 'Sign in to your account', sub: 'Enter your details to follow your triage and your visits.', campo: 'CPF or email', ph: '000.000.000-00 or you@example.com', aviso: 'Your data is protected and used only to identify your access to the system, in line with LGPD.' },
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
      novaTriagem: 'New triage', atualizado: 'Updated at', min: 'min', excedido: 'target exceeded',
      fila: { titulo: 'Care queue', vazio: 'No patients waiting.' },
      leitos: { titulo: 'Bed map', ocupacao: 'occupied', setores: { enfermaria: 'Ward', uti: 'ICU', observacao: 'Observation' }, status: { ocupado: 'Occupied', disponivel: 'Available', limpeza: 'Being cleaned', reservado: 'Reserved' } },
      indicadores: { titulo: 'Indicators', espera: 'Average wait', ocupacao: 'Bed occupancy', naFila: 'Patients in queue', criticos: 'Reds and oranges' },
      alertas: { titulo: 'Deterioration alerts', sub: 'Patients with a deterioration risk above 70%.', risco: 'risk', vazio: 'No alerts right now.' },
    },
    triagem: {
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
      eyebrow: 'Patient sign-up', titulo: 'Create your account', sub: 'Sign up to follow your triage and your visits.', voltar: 'Back to sign in',
      nome: 'Full name', nomePh: 'Your name', campo: 'CPF or email', ph: '000.000.000-00 or you@example.com', senha: 'Password', confirmar: 'Confirm password',
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
    nav: { principal: 'Principal', sobre: 'Sobre nosotros', empresas: 'Para empresas', idioma: 'Idioma', paciente: 'Soy Paciente', profissional: 'Acceso Profesional' },
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
      semContaProf: 'El acceso de profesionales lo proporciona la institución de salud.',
      erroCredenciais: 'No fue posible ingresar. Revise sus datos e intente de nuevo.',
      mfa: { titulo: 'Verificación en dos pasos', sub: 'Ingrese el código de 6 dígitos de su aplicación de autenticación.', campo: 'Código de verificación', ph: '000000', verificar: 'Verificar e ingresar', trocar: 'Usar otra cuenta', erro: 'Código inválido o vencido. Intente de nuevo.' },
      voltar: 'Volver al inicio', abas: 'Tipo de acceso', abaPaciente: 'Paciente', abaProf: 'Profesional',
      senha: 'Contraseña', senhaPh: 'Su contraseña', esqueci: 'Olvidé mi contraseña', mostrar: 'Mostrar contraseña', ocultar: 'Ocultar contraseña',
      entrar: 'Entrar de forma segura', semConta: '¿Aún no tiene una cuenta?', criar: 'Crear cuenta',
      paciente: { eyebrow: 'Área del paciente', titulo: 'Acceda a su cuenta', sub: 'Ingrese sus datos para seguir su triaje y sus atenciones.', campo: 'CPF o correo electrónico', ph: '000.000.000-00 o usted@ejemplo.com', aviso: 'Sus datos están protegidos y se usan solo para identificar su acceso al sistema, conforme a la LGPD.' },
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
      novaTriagem: 'Nuevo triaje', atualizado: 'Actualizado a las', min: 'min', excedido: 'meta superada',
      fila: { titulo: 'Fila de atención', vazio: 'Ningún paciente esperando.' },
      leitos: { titulo: 'Mapa de camas', ocupacao: 'ocupadas', setores: { enfermaria: 'Sala', uti: 'UCI', observacao: 'Observación' }, status: { ocupado: 'Ocupada', disponivel: 'Disponible', limpeza: 'En limpieza', reservado: 'Reservada' } },
      indicadores: { titulo: 'Indicadores', espera: 'Espera media', ocupacao: 'Ocupación de camas', naFila: 'Pacientes en fila', criticos: 'Rojos y naranjas' },
      alertas: { titulo: 'Alertas de deterioro', sub: 'Pacientes con riesgo de empeorar superior al 70%.', risco: 'de riesgo', vazio: 'Ninguna alerta por ahora.' },
    },
    triagem: {
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
      eyebrow: 'Registro de paciente', titulo: 'Cree su cuenta', sub: 'Regístrese para seguir su triaje y sus atenciones.', voltar: 'Volver al inicio de sesión',
      nome: 'Nombre completo', nomePh: 'Su nombre', campo: 'CPF o correo electrónico', ph: '000.000.000-00 o usted@ejemplo.com', senha: 'Contraseña', confirmar: 'Confirmar contraseña',
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
