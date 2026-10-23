import type { Usuario } from '../auth/tipos'
import { temSinalDeAlerta, type Resposta } from './entrevista'

// Etapas do atendimento do ponto de vista do paciente:
//  nenhuma → pre_triagem (enviada, falta ir ao hospital) → chegada (check-in; aguardando o enfermeiro)
//  → fila (triagem feita; mostra só a POSIÇÃO do paciente, nunca dados de outros pacientes).
// Em produção quem muda a etapa é a equipe (recepção e enfermagem), pelo backend.
export type EtapaAtendimento = 'nenhuma' | 'pre_triagem' | 'chegada' | 'fila'

export interface PreTriagem {
  id: string
  criadaEm: number
  queixa: string
  alerta: boolean
  respostas: Resposta[]
}

export interface DadosPaciente {
  etapa: EtapaAtendimento
  posicao: number // posição na fila (0 = é a vez do paciente)
  preTriagens: PreTriagem[]
}

const VAZIO: DadosPaciente = { etapa: 'nenhuma', posicao: 0, preTriagens: [] }
const chave = (id: string) => `triageai:paciente:${id}`

export const idPaciente = (u: Usuario): string => u.contato ?? u.nome

// MOCK: sessionStorage só para a demonstração. Com a API real, dados de saúde ficam
// no servidor (criptografados) e nunca no navegador.
export function carregarPaciente(id: string): DadosPaciente {
  try {
    const bruto = sessionStorage.getItem(chave(id))
    if (bruto) return JSON.parse(bruto) as DadosPaciente
  } catch { /* sem armazenamento: começa vazio */ }
  return VAZIO
}

function gravar(id: string, dados: DadosPaciente): DadosPaciente {
  try { sessionStorage.setItem(chave(id), JSON.stringify(dados)) } catch { /* ignora */ }
  return dados
}

export function salvarPreTriagem(id: string, respostas: Resposta[]): DadosPaciente {
  const atual = carregarPaciente(id)
  const nova: PreTriagem = {
    id: crypto.randomUUID(),
    criadaEm: Date.now(),
    queixa: respostas.find((r) => r.passo === 'queixa')?.valor ?? '',
    alerta: temSinalDeAlerta(respostas),
    respostas,
  }
  return gravar(id, {
    ...atual,
    etapa: atual.etapa === 'nenhuma' ? 'pre_triagem' : atual.etapa,
    preTriagens: [nova, ...atual.preTriagens],
  })
}

// Só para a demonstração: simula o que a equipe do hospital faria.
export function simularEtapa(id: string, etapa: EtapaAtendimento): DadosPaciente {
  const atual = carregarPaciente(id)
  return gravar(id, { ...atual, etapa, posicao: etapa === 'fila' ? 4 : 0 })
}

export function avancarFila(id: string): DadosPaciente {
  const atual = carregarPaciente(id)
  return gravar(id, { ...atual, posicao: Math.max(0, atual.posicao - 1) })
}
