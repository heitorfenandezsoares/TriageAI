import { useEffect, useState } from 'react'
import type { NivelManchester } from '../i18n/textos'
import type { DadosPainel, Leito, PacienteFila, SetorLeito, StatusLeito } from './tipos'

// FONTE SIMULADA, para demonstrar o painel sem o backend (VITE_DADOS_SIMULADOS=true).
const NIVEIS: NivelManchester[] = ['vermelho', 'laranja', 'amarelo', 'verde', 'azul']
const CICLO: StatusLeito[] = ['disponivel', 'reservado', 'ocupado', 'limpeza']
const INTERVALO_MS = 4000

const alea = <T,>(lista: T[]): T => lista[Math.floor(Math.random() * lista.length)]
const limitar = (n: number) => Math.min(1, Math.max(0, n))

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

const FILA_INICIAL: PacienteFila[] = [
  { id: 1, ini: 'M.S.', idade: 34, q: 0, nivel: 'azul', espera: 95, risco: 0.05 },
  { id: 2, ini: 'L.F.', idade: 27, q: 1, nivel: 'verde', espera: 48, risco: 0.12 },
  { id: 3, ini: 'C.R.', idade: 45, q: 2, nivel: 'amarelo', espera: 35, risco: 0.45 },
  { id: 4, ini: 'J.P.', idade: 61, q: 3, nivel: 'laranja', espera: 6, risco: 0.78 },
  { id: 5, ini: 'A.T.', idade: 19, q: 4, nivel: 'verde', espera: 22, risco: 0.08 },
  { id: 6, ini: 'B.N.', idade: 72, q: 6, nivel: 'amarelo', espera: 70, risco: 0.72 },
]

export function useDadosSimulados(): DadosPainel {
  const [dados, setDados] = useState<DadosPainel>(() => ({
    fila: FILA_INICIAL, leitos: criarLeitos(), atualizadoEm: Date.now(), status: 'ok',
  }))

  useEffect(() => {
    let proximoId = 100
    const id = setInterval(() => {
      setDados((atual) => {
        // passa o tempo e o risco oscila um pouco
        let fila = atual.fila.map((p) => ({
          ...p, espera: p.espera + 1, risco: limitar(p.risco + (Math.random() - 0.5) * 0.1),
        }))
        // chegada de paciente
        if (Math.random() < 0.3 && fila.length < 12) {
          fila = [...fila, {
            id: proximoId++, ini: alea(['R.A.', 'T.M.', 'D.C.', 'S.O.']), idade: 18 + Math.floor(Math.random() * 65),
            q: Math.floor(Math.random() * 7), nivel: alea(NIVEIS), espera: 0, risco: Math.random() * 0.8,
          }]
        }
        // atendimento: sai o de maior prioridade
        if (Math.random() < 0.2 && fila.length > 4) {
          const primeiro = [...fila].sort((a, b) => NIVEIS.indexOf(a.nivel) - NIVEIS.indexOf(b.nivel) || b.espera - a.espera)[0]
          fila = fila.filter((p) => p.id !== primeiro.id)
        }
        // um leito muda de status
        let leitos = atual.leitos
        if (Math.random() < 0.4) {
          const alvo = alea(leitos).id
          leitos = leitos.map((l) =>
            l.id === alvo ? { ...l, status: CICLO[(CICLO.indexOf(l.status) + 1) % CICLO.length] } : l,
          )
        }
        return { fila, leitos, atualizadoEm: Date.now(), status: 'ok' }
      })
    }, INTERVALO_MS)
    return () => clearInterval(id)
  }, [])

  return dados
}