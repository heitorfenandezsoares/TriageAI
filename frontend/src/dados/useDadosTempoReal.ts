import { useEffect, useState } from 'react'
import type { DadosPainel, Leito, PacienteFila } from './tipos'
import { apiFetch } from '../api'

const FILA_INICIAL: PacienteFila[] = [
  { id: 1, ini: 'M.S.', idade: 34, q: 0, nivel: 'azul', espera: 95, risco: 0.05 },
  { id: 2, ini: 'L.F.', idade: 27, q: 1, nivel: 'verde', espera: 48, risco: 0.12 },
  { id: 3, ini: 'C.R.', idade: 45, q: 2, nivel: 'amarelo', espera: 35, risco: 0.45 },
]

export function useDadosTempoReal(): DadosPainel {
  const [dados, setDados] = useState<DadosPainel>({
    fila: FILA_INICIAL,
    leitos: [],
    atualizadoEm: Date.now(),
  })

  useEffect(() => {
    let montado = true

    async function carregarDados() {
      try {
        const [pacientes, leitos] = await Promise.all([
          apiFetch<PacienteFila[]>('/patients'),
          apiFetch<Leito[]>('/beds'),
        ])
        if (montado) {
          setDados({
            fila: pacientes.length > 0 ? pacientes : FILA_INICIAL,
            leitos,
            atualizadoEm: Date.now(),
          })
        }
      } catch (err) {
        console.warn('Falha ao sincronizar com backend, mantendo cache:', err)
      }
    }

    // Carga inicial do banco
    carregarDados()

    // Sincronização periódica com a API do NestJS a cada 4 segundos
    const intervalo = setInterval(carregarDados, 4000)

    return () => {
      montado = false
      clearInterval(intervalo)
    }
  }, [])

  return dados
}
