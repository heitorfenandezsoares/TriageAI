import type { NivelManchester } from '../i18n/textos'

export type SetorLeito = 'enfermaria' | 'uti' | 'observacao'
export type StatusLeito = 'ocupado' | 'disponivel' | 'limpeza' | 'reservado'

export interface PacienteFila {
  id: number
  ini: string
  idade: number
  q: number
  nivel: NivelManchester
  espera: number 
  risco: number 
}

export interface Leito {
  id: string
  setor: SetorLeito
  status: StatusLeito
}

export interface DadosPainel {
  fila: PacienteFila[]
  leitos: Leito[]
  atualizadoEm: number
}
