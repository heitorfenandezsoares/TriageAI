import type { Modulo, Perfil } from './tipos'

// esta tabela só decide o que mostrar na interface.
export const MODULOS_POR_PERFIL: Record<Perfil, Modulo[]> = {
  recepcionista: ['fila'],
  enfermeiro: ['fila', 'triagem', 'leitos'],
  gestor: ['fila', 'leitos', 'indicadores'],
  paciente: ['fila'],
}

export const PERFIS_PROFISSIONAIS: Perfil[] = ['recepcionista', 'enfermeiro', 'gestor']

export const perfisComModulo = (modulo: Modulo): Perfil[] =>
  (Object.keys(MODULOS_POR_PERFIL) as Perfil[]).filter((p) => MODULOS_POR_PERFIL[p].includes(modulo))