import { useEffect, useState } from 'react'
import { apiFetch } from '../api'
import type { DadosPainel, Leito, PacienteFila } from './tipos'
import { useDadosSimulados } from './useDadosSimulados.ts'

const INTERVALO_MS = 4000

interface Opcoes {
  leitos: boolean // só busca os leitos para quem tem permissão (a recepção não tem)
}

// Dados reais da API. Se a conexão falhar, o painel AVISA (status 'erro') e nunca mostra
// pacientes inventados no lugar dos reais.
// TODO: trocar o polling por WebSocket quando o backend oferecer.
export function useDadosApi({ leitos: comLeitos }: Opcoes): DadosPainel {
  const [dados, setDados] = useState<DadosPainel>(() => ({
    fila: [], leitos: [], atualizadoEm: Date.now(), status: 'carregando',
  }))

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const [fila, leitos] = await Promise.all([
          apiFetch<PacienteFila[]>('/patients'),
          comLeitos ? apiFetch<Leito[]>('/beds') : Promise.resolve<Leito[]>([]),
        ])
        if (ativo) setDados({ fila, leitos, atualizadoEm: Date.now(), status: 'ok' })
      } catch {
        if (ativo) setDados((atual) => ({ ...atual, status: 'erro' }))
      }
    }

    void carregar()
    const id = setInterval(() => void carregar(), INTERVALO_MS)
    return () => {
      ativo = false
      clearInterval(id)
    }
  }, [comLeitos])

  return dados
}

// Com VITE_DADOS_SIMULADOS=true o painel usa dados sorteados (demonstração sem backend).
// A escolha é feita uma vez, ao carregar o módulo, então a ordem dos hooks nunca muda.
const SIMULADO = import.meta.env.VITE_DADOS_SIMULADOS === 'true'
export const useDadosTempoReal: (opcoes: Opcoes) => DadosPainel = SIMULADO ? useDadosSimulados : useDadosApi