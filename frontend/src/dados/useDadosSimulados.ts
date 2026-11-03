import { useState } from 'react'
import type { DadosPainel, Leito, PacienteFila, SetorLeito, StatusLeito } from './tipos'

function criarLeitos(): Leito[] {
  const setores: [SetorLeito, string, number][] = [
    ['enfermaria', 'E', 12], ['uti', 'U', 6], ['observacao', 'O', 8],
  ]
  const padrao: StatusLeito[] = ['ocupado', 'ocupado', 'disponivel', 'ocupado', 'limpeza', 'ocupado', 'reservado']
  return setores.flatMap(([setor, letra, n], s) =>
    Array.from({ length: n }, (_, i) => ({
      id: `${letra}${i + 1}`, setor, status: padrao[(i + s * 2) % padrao.length],
    })),
  )
}

const FILA_INICIAL: PacienteFila[] = []

export function useDadosSimulados(): DadosPainel {
  const [dados] = useState<DadosPainel>(() => ({
    fila: FILA_INICIAL, leitos: criarLeitos(), atualizadoEm: Date.now(), status: 'ok',
  }))

  return dados
}
