export type PassoId =
  | 'queixa'
  | 'inicio'
  | 'dor'
  | 'respiracao'
  | 'peito'
  | 'febre'
  | 'desmaio'

export type PassoEntrevistaId = PassoId | 'idade' | 'peso' | 'sintomas' | 'risco'

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

export const PERGUNTAS_PADRAO: Record<'idade' | 'peso' | 'sintomas', string> = {
  idade: 'Olá! Para darmos continuidade ao seu atendimento, qual é a sua idade?',
  peso: 'Obrigado. E qual é o seu peso aproximado (em kg)?',
  sintomas: 'O que você está sentindo hoje? Descreva seus sintomas.',
}

/**
 * Formula uma única pergunta fechada de triagem baseada nos sintomas descritos,
 * para descartar emergências imediatas.
 */
export function gerarPerguntaRisco(sintomas: string): string {
  const s = sintomas.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (/peito|coracao|cardiac|pressao|aperto|palpitacao/.test(s)) {
    return 'Você está com dor forte ou aperto no peito, palpitações ou sensação de desmaio?'
  }
  if (/respir|ar|falta de ar|folego|sufoco|asfixia/.test(s)) {
    return 'Você está com dificuldade extrema para respirar, lábios arroxeados ou chiado forte no peito?'
  }
  if (/cabeca|nuca|tontura|desmaio|convuls|visao|dormencia|formig/.test(s)) {
    return 'Você teve desmaio, perda súbita de força em um dos lados do corpo ou rigidez no pescoço?'
  }
  if (/barriga|abd|estomago|vomit|sangue|sangra/.test(s)) {
    return 'A dor é súbita e intensa, acompanhada de vômitos contínuos ou presença de sangue?'
  }
  return 'Você está com dor forte no peito ou dificuldade extrema para respirar?'
}

/**
 * Fornece breve orientação de conforto e primeiros socorros gerais não-medicamentosos.
 * ESTRITAMENTE SEM MEDICAMENTOS E SEM DIAGNÓSTICO.
 */
export function gerarOrientacaoConforto(sintomas: string): string {
  const s = sintomas.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  if (/febre|quente|calafrio|temperatura/.test(s)) {
    return 'Orientações de conforto e primeiros socorros: Mantenha repouso em ambiente ventilado, beba bastante água para manter a hidratação e aplique compressas frescas e úmidas na testa para alívio térmico.'
  }
  if (/cabeca|enxaqueca|cefaleia|tontura/.test(s)) {
    return 'Orientações de conforto e primeiros socorros: Procure descansar em um quarto silencioso e com luz suave, mantenha boa hidratação com água e faça compressas mornas ou frias na região temporal ou nuca.'
  }
  if (/garganta|tosse|gripe|resfriado|coriza/.test(s)) {
    return 'Orientações de conforto e primeiros socorros: Beba água fresca ou líquidos naturais com frequência para manter a garganta hidratada, repouse com a cabeça ligeiramente elevada e mantenha o ambiente arejado.'
  }
  if (/dor no corpo|costas|lombar|muscular|coluna|perna|braco/.test(s)) {
    return 'Orientações de conforto e primeiros socorros: Permaneça em repouso evitando esforços físicos, adote posições confortáveis para o corpo e mantenha boa ingestão de água.'
  }
  return 'Orientações de conforto e primeiros socorros: Procure repousar em uma posição confortável e arejada, mantenha hidratação contínua com água e evite esforços físicos enquanto aguarda a equipe de saúde.'
}

/**
 * Determina o nível de urgência e os sinais de alerta clínicos.
 */
export function determinarUrgenciaERedFlags(
  sintomas: string,
  temEmergencia: boolean
): { urgencia: 'Baixo' | 'Médio' | 'Alto'; redFlags: string } {
  if (temEmergencia) {
    return {
      urgencia: 'Alto',
      redFlags: 'Identificados: Sim - Sinais de risco imediato (dor torácica / desconforto respiratório ou neurológico)',
    }
  }

  const s = sintomas.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const moderado = /febre|muita dor|dor intensa|vomito|diarreia|tontura|forte|dias|piora/.test(s)

  return {
    urgencia: moderado ? 'Médio' : 'Baixo',
    redFlags: 'Não identificados',
  }
}

/**
 * Gera a tabela de triagem no formato Markdown obrigatório.
 */
export function gerarTabelaMarkdown(
  idade: string,
  peso: string,
  sintomas: string,
  redFlags: string,
  urgencia: 'Baixo' | 'Médio' | 'Alto'
): string {
  const idadeFmt = idade.toLowerCase().includes('ano') ? idade : `${idade.replace(/[^\d]/g, '') || idade} anos`
  const pesoFmt = peso.toLowerCase().includes('kg') ? peso : `${peso.replace(/[^\d.,]/g, '') || peso} kg`

  return `| Métrica / Dado | Informação Coletada |
| :--- | :--- |
| **Idade** | ${idadeFmt} |
| **Peso** | ${pesoFmt} |
| **Queixa Principal** | ${sintomas} |
| **Sinais de Alerta (Red Flags)** | ${redFlags} |
| **Nível de Urgência** | ${urgencia} |`
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
