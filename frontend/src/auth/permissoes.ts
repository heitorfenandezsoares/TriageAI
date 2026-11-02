import type { Modulo, Perfil } from './tipos'

/**
 * Normaliza o perfil vindo do banco de dados (evita erros com maiúsculas/minúsculas,
 * espaços ou termos como 'profissional', 'medico', 'admin').
 */
export function normalizarPerfil(p?: string): Perfil {
  if (!p) return 'paciente'
  const limpo = p.toLowerCase().trim()
  if (['enfermeiro', 'enfermeira'].includes(limpo)) return 'enfermeiro'
  if (['gestor', 'gestora', 'admin', 'administrador'].includes(limpo)) return 'gestor'
  if (['recepcionista', 'recepcao', 'recepção'].includes(limpo)) return 'recepcionista'
  if (['profissional', 'medico', 'médica', 'doutor', 'doutora'].includes(limpo)) return 'enfermeiro'
  return 'paciente'
}

// Esta tabela decide os módulos disponíveis na interface
export const MODULOS_POR_PERFIL: Record<Perfil, Modulo[]> = {
  recepcionista: ['fila'],
  enfermeiro: ['fila', 'triagem', 'leitos'],
  gestor: ['fila', 'leitos', 'indicadores'],
  paciente: ['fila'],
}

export const PERFIS_PROFISSIONAIS: Perfil[] = ['recepcionista', 'enfermeiro', 'gestor']

export const ehProfissional = (perfil?: string): boolean => {
  const norm = normalizarPerfil(perfil)
  return PERFIS_PROFISSIONAIS.includes(norm)
}

export const perfisComModulo = (modulo: Modulo): Perfil[] =>
  (Object.keys(MODULOS_POR_PERFIL) as Perfil[]).filter((p) => MODULOS_POR_PERFIL[p].includes(modulo))
