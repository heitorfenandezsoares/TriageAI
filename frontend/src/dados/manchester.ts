import type { NivelManchester } from '../i18n/textos'

export const ORDEM_NIVEL: Record<NivelManchester, number> = {
  vermelho: 0, laranja: 1, amarelo: 2, verde: 3, azul: 4,
}

export const ALVO_MIN: Record<NivelManchester, number> = {
  vermelho: 0, laranja: 10, amarelo: 60, verde: 120, azul: 240,
}
