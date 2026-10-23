export type PassoId = 'queixa' | 'inicio' | 'dor' | 'respiracao' | 'peito' | 'febre' | 'desmaio'
export type TipoPasso = 'texto' | 'opcoes' | 'escala' | 'simnao'

export interface Passo {
  id: PassoId
  tipo: TipoPasso
  alerta?: boolean // "sim" nesta pergunta é um sinal de alerta
}

export interface Resposta {
  passo: PassoId
  valor: string // texto livre, índice da opção, "0".."10" ou "sim"/"nao"
}

// Roteiro fixo da pré-triagem (sem IA): perguntas simples e sinais de alerta conhecidos.
// Não classifica o paciente — só organiza as informações e avisa quando algo parece grave.
export const PASSOS: Passo[] = [
  { id: 'queixa', tipo: 'texto' },
  { id: 'inicio', tipo: 'opcoes' },
  { id: 'dor', tipo: 'escala' },
  { id: 'respiracao', tipo: 'simnao', alerta: true },
  { id: 'peito', tipo: 'simnao', alerta: true },
  { id: 'febre', tipo: 'simnao' },
  { id: 'desmaio', tipo: 'simnao', alerta: true },
]

export function ehAlerta(passo: Passo, valor: string): boolean {
  if (passo.alerta) return valor === 'sim'
  if (passo.id === 'dor') return Number(valor) >= 9
  return false
}

export function temSinalDeAlerta(respostas: Resposta[]): boolean {
  return respostas.some((r) => {
    const passo = PASSOS.find((p) => p.id === r.passo)
    return passo ? ehAlerta(passo, r.valor) : false
  })
}
