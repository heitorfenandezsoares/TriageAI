import { useEffect, useState } from 'react'
import type { DadosPainel, Leito, PacienteFila } from './tipos'
import { apiFetch } from '../api'

const FILA_INICIAL: PacienteFila[] = [
  { id: 1, ini: 'M.S.', idade: 34, q: 0, nivel: 'azul', espera: 95, risco: 0.05 },
  { id: 2, ini: 'L.F.', idade: 27, q: 1, nivel: 'verde', espera: 48, risco: 0.12 },
  { id: 3, ini: 'C.R.', idade: 45, q: 2, nivel: 'amarelo', espera: 35, risco: 0.45 },
]

<<<<<<< Updated upstream
export function useDadosTempoReal(): DadosPainel {
  const [dados, setDados] = useState<DadosPainel>({
    fila: FILA_INICIAL,
    leitos: [],
    atualizadoEm: Date.now(),
  })
=======
interface Opcoes {
  leitos: boolean // só busca os leitos para quem tem permissão (a recepção não tem)
}

// Dados reais da API. Se a conexão falhar, o painel AVISA (status 'erro') e nunca mostra
// pacientes inventados no lugar dos reais.
// TODO: trocar o polling por WebSocket quando o backend oferecer.
export function useDadosApi({ leitos: comLeitos }: Opcoes = { leitos: true }): DadosPainel {
  const [dados, setDados] = useState<DadosPainel>(() => ({
    fila: [], leitos: [], atualizadoEm: Date.now(), status: 'carregando',
  }))
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======

// Com VITE_DADOS_SIMULADOS=true o painel usa dados sorteados (demonstração sem backend).
// A escolha é feita uma vez, ao carregar o módulo, então a ordem dos hooks nunca muda.
const SIMULADO = import.meta.env.VITE_DADOS_SIMULADOS === 'true'
export const useDadosTempoReal: (opcoes?: Opcoes) => DadosPainel = SIMULADO ? useDadosSimulados : (opcoes = { leitos: true }) => useDadosApi(opcoes)
>>>>>>> Stashed changes
