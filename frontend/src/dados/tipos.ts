import type { NivelManchester } from '../i18n/textos'

export type SetorLeito = 'enfermaria' | 'uti' | 'observacao'
export type StatusLeito = 'ocupado' | 'disponivel' | 'limpeza' | 'reservado'

export interface PacienteFila {
  id: number
  ini: string
  idade: number
  q: number // índice da queixa em textos.painel.queixas
  nivel: NivelManchester
  espera: number // minutos
  risco: number // risco de deterioração, 0 a 1
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
  status: 'carregando' | 'ok' | 'erro' // 'erro': sem conexão com o servidor (dados podem estar velhos)
}