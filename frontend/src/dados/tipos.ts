export type Perfil = 'recepcionista' | 'enfermeiro' | 'gestor' | 'paciente'
export type Modulo = 'fila' | 'triagem' | 'leitos' | 'indicadores'

export interface Usuario {
  nome: string
  perfil: Perfil
  contato?: string // e-mail verificado do paciente (chave dos dados dele)
}

export interface Sessao {
  usuario: Usuario
  expiraEm: number // timestamp (ms)
}
