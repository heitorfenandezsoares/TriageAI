export type PassoId =
  | 'queixa'
  | 'inicio'
  | 'dor'
  | 'respiracao'
  | 'peito'
  | 'febre'
  | 'desmaio'

export type PassoEntrevistaId =
  | PassoId
  | 'idade'
  | 'peso'
  | 'sintomas'
  | 'detalhes'
  | 'risco'

export type TipoPasso = 'texto' | 'opcoes' | 'escala' | 'simnao'

export interface Passo {
  id: PassoId
  tipo: TipoPasso
  alerta?: boolean
}

export interface Resposta {
  passo: PassoId | PassoEntrevistaId
  valor: string
}

export const PASSOS: Passo[] = [
  { id: 'queixa', tipo: 'texto' },
  { id: 'inicio', tipo: 'opcoes' },
  { id: 'dor', tipo: 'escala' },
  { id: 'respiracao', tipo: 'simnao', alerta: true },
  { id: 'peito', tipo: 'simnao', alerta: true },
  { id: 'febre', tipo: 'simnao' },
  { id: 'desmaio', tipo: 'simnao', alerta: true },
]

export const PERGUNTAS_PADRAO: Record<'idade' | 'peso' | 'sintomas' | 'detalhes', string> = {
  idade:
    'Olá! Sou o Assistente Clínico Inteligente do TriageAI. Você pode digitar, usar o microfone 🎤, escolher nos botões rápidos abaixo ou até contar tudo de uma vez (ex: "Tenho 32 anos, 70kg e estou com febre"). Para começar, qual é a sua idade?',
  peso:
    'Perfeito! E qual é o seu peso aproximado (em kg)? Você pode selecionar uma faixa abaixo ou digitar.',
  sintomas:
    'O que você está sentindo hoje? Você pode selecionar um ou mais sintomas nos cartões abaixo, escolher pela região do corpo, falar pelo microfone ou descrever livremente.',
  detalhes:
    'Para calibrar melhor a prioridade do seu atendimento: qual a intensidade da dor/desconforto (de 0 a 10), há quanto tempo começou e se possui alguma condição de saúde prévia?',
}

export interface OpcaoSintomaRapido {
  id: string
  icone: string
  rotulo: string
  textoClinico: string
  regiao: RegiaoCorpoId
}

export type RegiaoCorpoId =
  | 'cabeca'
  | 'torax'
  | 'respiratorio'
  | 'abdomen'
  | 'muscular'
  | 'geral'

export const REGIOES_CORPO: { id: RegiaoCorpoId; icone: string; nome: string; exemplos: string[] }[] = [
  {
    id: 'cabeca',
    icone: '🧠',
    nome: 'Cabeça, Olhos e Garganta',
    exemplos: ['Dor de cabeça intensa', 'Tontura ou vertigem', 'Dor de garganta', 'Alteração na visão', 'Dor de ouvido'],
  },
  {
    id: 'torax',
    icone: '❤️',
    nome: 'Peito e Coração',
    exemplos: ['Dor ou aperto no peito', 'Palpitações / coração acelerado', 'Queimação retroesternal', 'Pressão alta'],
  },
  {
    id: 'respiratorio',
    icone: '🫁',
    nome: 'Pulmões e Respiração',
    exemplos: ['Falta de ar / cansaço ao respirar', 'Tosse seca persistente', 'Tosse com catarro', 'Chiado no peito', 'Congestão nasal / coriza'],
  },
  {
    id: 'abdomen',
    icone: '🤢',
    nome: 'Abdômen, Estômago e Urinário',
    exemplos: ['Dor abdominal / cólica forte', 'Enjoo e vômitos', 'Diarreia aguda', 'Azia / queimação no estômago', 'Dor ou ardência ao urinar'],
  },
  {
    id: 'muscular',
    icone: '🦴',
    nome: 'Costas, Membros e Trauma',
    exemplos: ['Dor lombar / nas costas', 'Dor muscular no corpo', 'Torção ou trauma em braço/perna', 'Corte ou ferimento com sangramento', 'Inchaço nas articulações'],
  },
  {
    id: 'geral',
    icone: '🤒',
    nome: 'Geral, Pele e Febre',
    exemplos: ['Febre alta e calafrios', 'Mal-estar e fraqueza intensa', 'Manchas ou coceira na pele (alergia)', 'Desmaio ou sonolência anormal'],
  },
]

export const CATALOGO_SINTOMAS: OpcaoSintomaRapido[] = [
  { id: 'febre', icone: '🤒', rotulo: 'Febre / Calafrios', textoClinico: 'Febre e calafrios', regiao: 'geral' },
  { id: 'cefaleia', icone: '🤕', rotulo: 'Dor de Cabeça', textoClinico: 'Dor de cabeça (cefaleia)', regiao: 'cabeca' },
  { id: 'peito', icone: '❤️', rotulo: 'Dor no Peito', textoClinico: 'Dor ou aperto no peito', regiao: 'torax' },
  { id: 'dispneia', icone: '🫁', rotulo: 'Falta de Ar', textoClinico: 'Falta de ar / dificuldade respiratória', regiao: 'respiratorio' },
  { id: 'tosse', icone: '🗣️', rotulo: 'Tosse / Garganta', textoClinico: 'Tosse e dor de garganta', regiao: 'respiratorio' },
  { id: 'abdomen', icone: '🤢', rotulo: 'Dor Abdominal / Enjoo', textoClinico: 'Dor abdominal acompanhada de náusea/enjoo', regiao: 'abdomen' },
  { id: 'corpo', icone: '🦴', rotulo: 'Dor no Corpo / Costas', textoClinico: 'Dor muscular no corpo e região lombar', regiao: 'muscular' },
  { id: 'tontura', icone: '😵', rotulo: 'Tontura / Fraqueza', textoClinico: 'Tontura, mal-estar e fraqueza', regiao: 'cabeca' },
  { id: 'trauma', icone: '🩸', rotulo: 'Corte / Queda / Trauma', textoClinico: 'Trauma físico / ferimento', regiao: 'muscular' },
  { id: 'alergia', icone: '🔥', rotulo: 'Alergia / Manchas', textoClinico: 'Reação alérgica / placas ou coceira na pele', regiao: 'geral' },
  { id: 'urinario', icone: '🚽', rotulo: 'Dor ao Urinar', textoClinico: 'Dor ou ardência ao urinar (disúria)', regiao: 'abdomen' },
  { id: 'pressao', icone: '💓', rotulo: 'Pressão Alta / Palpitação', textoClinico: 'Pico de pressão alta / taquicardia', regiao: 'torax' },
]

export const OPCOES_IDADE_RAPIDA = [
  { rotulo: '👶 0 a 11 anos', valor: '8 anos (Criança)' },
  { rotulo: '🧑 12 a 17 anos', valor: '15 anos' },
  { rotulo: ' 청년 18 a 29 anos', valor: '24 anos' },
  { rotulo: '👨 30 a 44 anos', valor: '36 anos' },
  { rotulo: '🧔 45 a 59 anos', valor: '52 anos' },
  { rotulo: '👵 60 a 74 anos', valor: '66 anos' },
  { rotulo: '👴 75+ anos', valor: '78 anos' },
]

export const OPCOES_PESO_RAPIDO = [
  'Até 45 kg',
  '55 kg',
  '65 kg',
  '75 kg',
  '85 kg',
  '95 kg',
  '105+ kg',
  'Não sei informar',
]

export const OPCOES_TEMPO_INICIO = [
  'Começou agora (< 2h)',
  'Hoje (algumas horas)',
  'Há 1 a 3 dias',
  'Há mais de 4 dias',
]

export const OPCOES_COMORBIDADES = [
  'Nenhuma',
  'Hipertensão (Pressão Alta)',
  'Diabetes',
  'Asma / Bronquite',
  'Cardiopatia',
  'Gestante',
  'Alergia Medicamentosa',
]

export interface ExtracaoNLU {
  idadeExtraida?: string
  pesoExtraido?: string
  sintomasExtraidos?: string
  dorExtraida?: number
  tempoExtraido?: string
  temSinalCriticoImediato?: boolean
}

/**
 * Motor NLU (Natural Language Understanding) que analisa frases completas do paciente
 * para extrair múltiplos dados clínicos de uma só vez.
 */
export function analisarTextoLivre(texto: string): ExtracaoNLU {
  const resultado: ExtracaoNLU = {}
  const limpo = texto.trim()
  const norm = limpo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // 1. Extração de Idade (ex: "tenho 32 anos", "32 anos", "idade 45")
  const matchIdadeExplicita = norm.match(/\b(?:tenho|idade|com)?\s*(\d{1,3})\s*(?:anos?|a\.?)\b/i)
  if (matchIdadeExplicita) {
    const n = parseInt(matchIdadeExplicita[1], 10)
    if (n >= 0 && n <= 122) {
      resultado.idadeExtraida = `${n} anos`
    }
  }

  // 2. Extração de Peso (ex: "72kg", "peso 80 quilos", "72.5 kg")
  const matchPeso = norm.match(/\b(?:peso|pesando)?\s*(\d{1,3}(?:[.,]\d{1,2})?)\s*(?:kg|quilos?|kilos?)\b/i)
  if (matchPeso) {
    resultado.pesoExtraido = `${matchPeso[1].replace(',', '.')} kg`
  }

  // 3. Extração de Escala de Dor (ex: "dor 8", "nota 9")
  const matchDor = norm.match(/\b(?:dor|nota|intensidade|nivel)\s*(?:de\s*)?(\d{1,2})(?:\s*\/\s*10)?\b/i)
  if (matchDor) {
    const d = parseInt(matchDor[1], 10)
    if (d >= 0 && d <= 10) resultado.dorExtraida = d
  }

  // 4. Extração de Tempo de Início
  if (/agora|pouco|minutos|1 hora|meia hora/.test(norm)) {
    resultado.tempoExtraido = 'Começou agora (< 2h)'
  } else if (/hoje|cedo|manha|tarde|noite/.test(norm)) {
    resultado.tempoExtraido = 'Hoje (algumas horas)'
  } else if (/ontem|2 dias|3 dias|dois dias|tres dias/.test(norm)) {
    resultado.tempoExtraido = 'Há 1 a 3 dias'
  } else if (/semana|mes|dias/.test(norm)) {
    resultado.tempoExtraido = 'Há mais de 4 dias'
  }

  // 5. Detecção de Sintomas presentes na frase
  const palavrasSintomas =
    /dor|febre|tosse|falta de ar|peito|cabeca| barriga|abdomen|vomit|enjoo|nausea|diarreia|tontura|desmaio|sangr|corte|queda|alergia|coceira|garganta|coriza|gripe|pressao|palpitacao|fraqueza|calafrio|ardencia|inchaco|costas|lombar|corpo/i
  if (palavrasSintomas.test(norm)) {
    // Limpa trechos de idade e peso para isolar melhor a queixa se o usuário mandou tudo junto
    let queixaIsolada = limpo
      .replace(/\b(?:eu\s+)?tenho\s+\d{1,3}\s*anos?\s*(?:e\s+|,\s*)?/gi, '')
      .replace(/\b(?:meu\s+)?peso\s*(?:e|é)?\s*\d{1,3}(?:[.,]\d{1,2})?\s*(?:kg|quilos?)\s*(?:e\s+|,\s*)?/gi, '')
      .replace(/\b\d{1,3}(?:[.,]\d{1,2})?\s*(?:kg|quilos?)\s*(?:e\s+|,\s*)?/gi, '')
      .replace(/^(?:estou\s+com|sinto|sentindo)\s+/i, '')
      .trim()

    if (queixaIsolada.length >= 3) {
      resultado.sintomasExtraidos = queixaIsolada.charAt(0).toUpperCase() + queixaIsolada.slice(1)
    }
  }

  // 6. Sinal crítico imediato
  if (/infarto|avc|derrame|desmaiando|nao consigo respirar|sufocando|sangramento intenso|vomito com sangue|convulsao/.test(norm)) {
    resultado.temSinalCriticoImediato = true
  }

  return resultado
}

/**
 * Formula uma pergunta fechada inteligente e contextualizada baseada nos sintomas descritos
 * para rastreio de sinais de alarme (Red Flags de Manchester).
 */
export function gerarPerguntaRisco(sintomas: string): string {
  const s = sintomas.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (/peito|coracao|cardiac|pressao|aperto|palpitacao|taquicardia/.test(s)) {
    return '🩺 Avaliação de Segurança Cardiovascular: Essa dor ou desconforto no peito irradia para o braço esquerdo, costas ou mandíbula, ou vem acompanhada de suor frio e falta de ar?'
  }
  if (/respir|ar|falta de ar|folego|sufoco|asfixia|chiado|tosse/.test(s)) {
    return '🩺 Avaliação de Segurança Respiratória: Você sente dificuldade para falar frases completas sem tomar fôlego, lábios arroxeados ou esforço intenso para puxar o ar?'
  }
  if (/cabeca|nuca|tontura|desmaio|convuls|visao|dormencia|formig|enxaqueca/.test(s)) {
    return '🩺 Avaliação de Segurança Neurológica: Você apresenta perda súbita de força ou formigamento em um lado do corpo, dificuldade para falar, confusão mental ou rigidez na nuca?'
  }
  if (/barriga|abd|estomago|vomit|sangue|sangra|diarreia|enjoo/.test(s)) {
    return '🩺 Avaliação de Segurança Abdominal: A dor abdominal é extremamente intensa e rígida ao toque, ou há vômitos persistentes que impedem beber líquidos / presença de sangue?'
  }
  if (/corte|queda|trauma|fratura|acidente|pancada/.test(s)) {
    return '🩺 Avaliação de Trauma: Há sangramento ativo que não estanca com compressão, deformidade visível no membro ou houve perda de consciência após o trauma?'
  }
  if (/febre|calafrio|infeccao|mancha|alergia/.test(s)) {
    return '🩺 Avaliação Sistêmica: Há presença de manchas roxas na pele, inchaço nos lábios/língua, prostração extrema ou febre acima de 39°C que não cede?'
  }
  return '🩺 Avaliação de Segurança Clínica: Você está sentindo dor forte no peito, dificuldade importante para respirar, sensação de desmaio ou piora rápida nos últimos minutos?'
}

/**
 * Fornece orientação personalizada de conforto e primeiros socorros não-medicamentosos.
 * ESTRITAMENTE SEM MEDICAMENTOS E SEM DIAGNÓSTICO.
 */
export function gerarOrientacaoConforto(sintomas: string): string {
  const s = sintomas.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (/febre|quente|calafrio|temperatura/.test(s)) {
    return '💡 Orientações de Conforto Clínico: Mantenha repouso em ambiente fresco e ventilado, use roupas leves, hidrate-se com pequenos goles de água regularmente e, se desejar, aplique compressas úmidas em temperatura ambiente na testa.'
  }
  if (/cabeca|enxaqueca|cefaleia|tontura/.test(s)) {
    return '💡 Orientações de Conforto Clínico: Permaneça sentado ou deitado em local calmo e com iluminação reduzida, evite movimentos bruscos com a cabeça para prevenir quedas e aplique uma compressa fria na testa ou nuca.'
  }
  if (/garganta|tosse|gripe|resfriado|coriza|respir/.test(s)) {
    return '💡 Orientações de Conforto Clínico: Permaneça sentado com o tronco levemente inclinado para frente ou recostado com travesseiros altos (facilita a expansão pulmonar), respire lenta e profundamente e mantenha a garganta úmida com água.'
  }
  if (/barriga|abd|estomago|vomit|enjoo|diarreia/.test(s)) {
    return '💡 Orientações de Conforto Clínico: Evite alimentos sólidos pesados no momento, dê preferência a pequenos goles de água ou soro de reidratação oral pausadamente e repouse de lado ou com os joelhos levemente flexionados para aliviar a tensão abdominal.'
  }
  if (/dor no corpo|costas|lombar|muscular|coluna|perna|braco|trauma|corte/.test(s)) {
    return '💡 Orientações de Conforto Clínico: Mantenha a região afetada em repouso e imobilizada em posição confortável, evite apoiar peso sobre o local e, em caso de pequeno ferimento superficial, mantenha comprimido com pano limpo e seco.'
  }
  return '💡 Orientações de Conforto Clínico: Permaneça em repouso em uma posição confortável e segura, respire calmamente, mantenha hidratação com água (caso não tenha náuseas) e aguarde a chamada prioritária da equipe de enfermagem.'
}

export interface ResultadoAvaliacaoClinica {
  urgencia: 'Baixo' | 'Médio' | 'Alto'
  corManchester: 'Vermelho (Emergência)' | 'Laranja (Muito Urgente)' | 'Amarelo (Urgente)' | 'Verde (Pouco Urgente)' | 'Azul (Não Urgente)'
  especialidadeSugerida: string
  redFlags: string
  alertaCritico: boolean
}

/**
 * Avalia de forma multifatorial (Sintomas + Sinais de Alerta + Escala de Dor EVA + Idade + Comorbidades)
 * a prioridade clínica de pré-triagem baseada no Protocolo de Manchester.
 */
export function avaliarCasoClinicoCompleto(params: {
  idade: string
  peso: string
  sintomas: string
  nivelRisco: 'sim' | 'moderado' | 'nao'
  dor?: number
  tempoInicio?: string
  comorbidades?: string[]
}): ResultadoAvaliacaoClinica {
  const { idade, sintomas, nivelRisco, dor = 0, comorbidades = [] } = params
  const s = sintomas.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const idadeNum = parseInt(idade.replace(/\D/g, ''), 10) || 30
  const idosoOuCriancaPequena = idadeNum >= 65 || idadeNum <= 5
  const temComorbidadeCardioResp = comorbidades.some((c) => /Hipertens|Cardio|Asma|Diabetes|Gestante/i.test(c))

  // Determina especialidade/eixo clínico sugerido
  let especialidadeSugerida = 'Clínica Médica / Pronto Atendimento'
  if (/peito|coracao|palpitacao|pressao/.test(s)) especialidadeSugerida = 'Cardiologia / Sala de Emergência'
  else if (/respir|falta de ar|tosse|chiado|pulmao/.test(s)) especialidadeSugerida = 'Pneumologia / Vias Aéreas'
  else if (/cabeca|desmaio|convuls|formig|tontura|visao/.test(s)) especialidadeSugerida = 'Neurologia Clínica'
  else if (/barriga|abd|vomit|diarreia|estomago/.test(s)) especialidadeSugerida = 'Gastroenterologia / Clínica'
  else if (/trauma|queda|fratura|torcao|corte|lombar|costas/.test(s)) especialidadeSugerida = 'Ortopedia e Traumatologia'

  // Caso 1: Emergência / Muito Urgente (Red Flag Positivo ou Dor Extrema 9-10 ou Sintoma Crítico)
  if (nivelRisco === 'sim' || dor >= 9 || /infarto|avc|nao consigo respirar|desmaio|sangramento intenso/.test(s)) {
    const ehVermelho = nivelRisco === 'sim' && (dor >= 9 || /peito|respir|desmaio|convuls/.test(s))
    return {
      urgencia: 'Alto',
      corManchester: ehVermelho ? 'Vermelho (Emergência)' : 'Laranja (Muito Urgente)',
      especialidadeSugerida,
      redFlags: `Sim — Sinais de alerta presentes (${dor >= 8 ? `Dor intensa EVA ${dor}/10, ` : ''}sintomatologia aguda de alto risco)`,
      alertaCritico: true,
    }
  }

  // Caso 2: Urgência Moderada (Sinal leve/intermitente, Dor 5-8, Febre/Vômito, Idoso/Criança com comorbidade)
  const sintomaModerado = /febre|muita dor|dor intensa|vomito|diarreia|tontura|forte|falta de ar|peito|sangr|alergia|pressao/.test(s)
  if (nivelRisco === 'moderado' || (dor >= 5 && dor <= 8) || sintomaModerado || (idosoOuCriancaPequena && temComorbidadeCardioResp)) {
    return {
      urgencia: 'Médio',
      corManchester: 'Amarelo (Urgente)',
      especialidadeSugerida,
      redFlags:
        nivelRisco === 'moderado'
          ? `Atenção moderada (Sinais leves/intermitentes relatados${dor ? ` • Dor ${dor}/10` : ''})`
          : `Não identificados sinais críticos imediatos (Monitorar evolução${dor >= 5 ? ` • Dor ${dor}/10` : ''})`,
      alertaCritico: false,
    }
  }

  // Caso 3: Baixa Urgência (Verde / Azul)
  return {
    urgencia: 'Baixo',
    corManchester: dor >= 2 ? 'Verde (Pouco Urgente)' : 'Azul (Não Urgente)',
    especialidadeSugerida,
    redFlags: 'Não identificados',
    alertaCritico: false,
  }
}

/**
 * Mantém compatibilidade direta com chamadas simples de urgência e redFlags.
 */
export function determinarUrgenciaERedFlags(
  sintomas: string,
  temEmergencia: boolean
): { urgencia: 'Baixo' | 'Médio' | 'Alto'; redFlags: string } {
  const av = avaliarCasoClinicoCompleto({
    idade: '30',
    peso: '70',
    sintomas,
    nivelRisco: temEmergencia ? 'sim' : 'nao',
  })
  return { urgencia: av.urgencia, redFlags: av.redFlags }
}

/**
 * Gera a tabela de triagem no formato Markdown enriquecido para o prontuário.
 */
export function gerarTabelaMarkdown(
  idade: string,
  peso: string,
  sintomas: string,
  redFlags: string,
  urgencia: 'Baixo' | 'Médio' | 'Alto',
  extras?: {
    dor?: number
    tempoInicio?: string
    comorbidades?: string[]
    corManchester?: string
    especialidade?: string
  }
): string {
  const idadeFmt = idade.toLowerCase().includes('ano') ? idade : `${idade.replace(/[^\d]/g, '') || idade} anos`
  const pesoFmt = peso.toLowerCase().includes('kg') || peso.toLowerCase().includes('informar')
    ? peso
    : `${peso.replace(/[^\d.,]/g, '') || peso} kg`

  const linhas = [
    `| Métrica / Dado | Informação Coletada |`,
    `| :--- | :--- |`,
    `| **Idade** | ${idadeFmt} |`,
    `| **Peso** | ${pesoFmt} |`,
    `| **Queixa Principal** | ${sintomas} |`,
  ]

  if (extras?.dor !== undefined) {
    linhas.push(`| **Intensidade da Dor (EVA)** | ${extras.dor}/10 |`)
  }
  if (extras?.tempoInicio) {
    linhas.push(`| **Início dos Sintomas** | ${extras.tempoInicio} |`)
  }
  if (extras?.comorbidades && extras.comorbidades.length > 0) {
    linhas.push(`| **Condições Prévias** | ${extras.comorbidades.join(', ')} |`)
  }
  if (extras?.corManchester) {
    linhas.push(`| **Classificação Sugerida (Manchester)** | ${extras.corManchester} |`)
  }
  if (extras?.especialidade) {
    linhas.push(`| **Eixo Clínico Sugerido** | ${extras.especialidade} |`)
  }

  linhas.push(`| **Sinais de Alerta (Red Flags)** | ${redFlags} |`)
  linhas.push(`| **Nível de Urgência** | ${urgencia} |`)

  return linhas.join('\n')
}

export function ehAlerta(passo: { id: PassoEntrevistaId; tipo?: TipoPasso; alerta?: boolean }, valor: string): boolean {
  if (passo.alerta) return valor === 'sim'
  if (passo.id === 'risco' || passo.id === 'desmaio' || passo.id === 'peito' || passo.id === 'respiracao') {
    return valor === 'sim'
  }
  return false
}

export function temSinalDeAlerta(respostas: Resposta[]): boolean {
  return respostas.some((r) => ehAlerta({ id: r.passo, tipo: 'simnao', alerta: true }, r.valor))
}
