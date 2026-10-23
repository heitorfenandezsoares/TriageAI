export type Perfil = 'recepcionista' | 'enfermeiro' | 'gestor' | 'paciente'
export type Modulo = 'fila' | 'triagem' | 'leitos' | 'indicadores'

export interface Usuario {
  nome: string
  perfil: Perfil
  contato?: string
}

export interface Sessao {
  usuario: Usuario
  expiraEm: number
}