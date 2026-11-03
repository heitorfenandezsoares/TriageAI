import type { Usuario } from '../auth/tipos'
import { apiFetch } from '../api'
import { temSinalDeAlerta, type Resposta } from './entrevista'

export type EtapaAtendimento = 'nenhuma' | 'pre_triagem' | 'chegada' | 'fila'

export interface PreTriagem {
  id: string
  criadaEm: number
  queixa: string
  alerta: boolean
  respostas: Resposta[]
  idade?: string
  peso?: string
  urgencia?: 'Baixo' | 'Médio' | 'Alto'
  redFlags?: string
  tabelaMarkdown?: string
  status?: string
}

export interface DadosPaciente {
  etapa: EtapaAtendimento
  posicao: number // posição na fila (0 = é a vez do paciente)
  preTriagens: PreTriagem[]
}

const VAZIO: DadosPaciente = { etapa: 'nenhuma', posicao: 0, preTriagens: [] }
const chave = (id: string) => `triageai:paciente:${id}`
const CHAVE_REMOVIDAS = 'triageai:pre_triagens_removidas'

function obterIdsRemovidos(): Set<string> {
  try {
    const raw = localStorage.getItem(CHAVE_REMOVIDAS)
    if (raw) return new Set<string>(JSON.parse(raw) as string[])
  } catch { /* ignora */ }
  return new Set<string>()
}

function registrarIdsRemovidos(ids: string[]) {
  try {
    const atual = obterIdsRemovidos()
    ids.forEach((id) => atual.add(id))
    localStorage.setItem(CHAVE_REMOVIDAS, JSON.stringify(Array.from(atual)))
  } catch { /* ignora */ }
}

export const idPaciente = (u: Usuario): string => (u as { email?: string; contato?: string; nome: string }).contato || (u as { email?: string; contato?: string; nome: string }).email || u.nome

// Carregamento síncrono local (localStorage com fallback para sessionStorage)
export function carregarPaciente(id: string): DadosPaciente {
  if (!id) return VAZIO
  try {
    const local = localStorage.getItem(chave(id))
    if (local) return JSON.parse(local) as DadosPaciente

    const sess = sessionStorage.getItem(chave(id))
    if (sess) return JSON.parse(sess) as DadosPaciente
  } catch { /* sem armazenamento: começa vazio */ }
  return VAZIO
}

function gravar(id: string, dados: DadosPaciente): DadosPaciente {
  if (!id) return dados
  try {
    const json = JSON.stringify(dados)
    localStorage.setItem(chave(id), json)
    sessionStorage.setItem(chave(id), json)
  } catch { /* ignora */ }
  return dados
}

export function salvarPreTriagem(
  id: string,
  respostas: Resposta[],
  complemento?: {
    idade?: string
    peso?: string
    queixa?: string
    alerta?: boolean
    urgencia?: 'Baixo' | 'Médio' | 'Alto'
    redFlags?: string
    tabelaMarkdown?: string
    pacienteNome?: string
  }
): DadosPaciente {
  const atual = carregarPaciente(id)
  const queixa = complemento?.queixa ?? respostas.find((r) => r.passo === 'sintomas' || r.passo === 'queixa')?.valor ?? ''
  const alerta = complemento?.alerta !== undefined ? complemento.alerta : temSinalDeAlerta(respostas)
  
  const nova: PreTriagem = {
    id: crypto.randomUUID(),
    criadaEm: Date.now(),
    queixa,
    alerta,
    respostas,
    idade: complemento?.idade,
    peso: complemento?.peso,
    urgencia: complemento?.urgencia,
    redFlags: complemento?.redFlags,
    tabelaMarkdown: complemento?.tabelaMarkdown,
    status: 'pendente',
  }

  const atualizado: DadosPaciente = {
    ...atual,
    etapa: atual.etapa === 'nenhuma' ? 'pre_triagem' : atual.etapa,
    preTriagens: [nova, ...atual.preTriagens],
  }

  gravar(id, atualizado)

  // Envia assincronamente ao banco de dados MySQL via NestJS
  void apiFetch('/patients/pre-triage', {
    method: 'POST',
    body: JSON.stringify({
      id: nova.id,
      pacienteId: id,
      pacienteNome: complemento?.pacienteNome || id,
      idade: nova.idade,
      peso: nova.peso,
      queixa: nova.queixa,
      alerta: nova.alerta,
      urgencia: nova.urgencia,
      redFlags: nova.redFlags,
      tabelaMarkdown: nova.tabelaMarkdown,
      respostas: JSON.stringify(nova.respostas),
      status: 'pendente',
    }),
  }).catch(() => {
    // Se a API estiver offline, o dado continua preservado no localStorage
  })

  // Dispara evento para atualização instantânea na UI sem recarregar página
  window.dispatchEvent(new CustomEvent('triageai:pre-triagem-atualizada', { detail: { id, preTriagem: nova } }))

  return atualizado
}

// Busca sincronizada com o backend para a área do paciente
export async function carregarPacienteAsync(id: string, _nome?: string): Promise<DadosPaciente> {
  const local = carregarPaciente(id)
  const removidos = obterIdsRemovidos()
  try {
    const remotas = await apiFetch<Array<{
      id: string
      idade?: string
      peso?: string
      queixa: string
      alerta: boolean
      urgencia?: 'Baixo' | 'Médio' | 'Alto'
      redFlags?: string
      tabelaMarkdown?: string
      status?: string
      criadoEm?: string
    }>>(`/patients/pre-triage/usuario/${encodeURIComponent(id)}`)

    if (Array.isArray(remotas) && remotas.length > 0) {
      const mapa = new Map<string, PreTriagem>()
      
      // Insere as do banco (exceto as já removidas)
      for (const r of remotas) {
        if (removidos.has(r.id)) continue
        mapa.set(r.id, {
          id: r.id,
          criadaEm: r.criadoEm ? new Date(r.criadoEm).getTime() : Date.now(),
          queixa: r.queixa,
          alerta: r.alerta,
          respostas: [],
          idade: r.idade,
          peso: r.peso,
          urgencia: r.urgencia,
          redFlags: r.redFlags,
          tabelaMarkdown: r.tabelaMarkdown,
          status: r.status,
        })
      }

      // Mescla com locais recentes se ainda não sincronizadas
      for (const l of local.preTriagens) {
        if (!removidos.has(l.id) && !mapa.has(l.id)) {
          mapa.set(l.id, l)
        }
      }

      const lista = Array.from(mapa.values()).sort((a, b) => b.criadaEm - a.criadaEm)
      const resultado: DadosPaciente = {
        ...local,
        etapa: lista.length === 0 && local.etapa === 'pre_triagem' ? 'nenhuma' : (local.etapa === 'nenhuma' && lista.length > 0 ? 'pre_triagem' : local.etapa),
        preTriagens: lista,
      }
      gravar(id, resultado)
      return resultado
    }
  } catch {
    // Falha silenciosa no backend, continua com os dados locais
  }
  return local
}

export function carregarTodasPreTriagens(): PreTriagem[] {
  const mapa = new Map<string, PreTriagem>()
  const removidos = obterIdsRemovidos()
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k?.startsWith('triageai:paciente:')) {
        const item = localStorage.getItem(k)
        if (item) {
          const parsed = JSON.parse(item) as DadosPaciente
          parsed?.preTriagens?.forEach((pt) => {
            if (!removidos.has(pt.id)) mapa.set(pt.id, pt)
          })
        }
      }
    }
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i)
      if (k?.startsWith('triageai:paciente:')) {
        const item = sessionStorage.getItem(k)
        if (item) {
          const parsed = JSON.parse(item) as DadosPaciente
          parsed?.preTriagens?.forEach((pt) => {
            if (!removidos.has(pt.id)) mapa.set(pt.id, pt)
          })
        }
      }
    }
  } catch { /* ignora */ }
  return Array.from(mapa.values()).sort((a, b) => b.criadaEm - a.criadaEm)
}

export async function carregarTodasPreTriagensAsync(): Promise<PreTriagem[]> {
  const locais = carregarTodasPreTriagens()
  const removidos = obterIdsRemovidos()
  try {
    const remotas = await apiFetch<Array<{
      id: string
      pacienteNome?: string
      idade?: string
      peso?: string
      queixa: string
      alerta: boolean
      urgencia?: 'Baixo' | 'Médio' | 'Alto'
      redFlags?: string
      tabelaMarkdown?: string
      status?: string
      criadoEm?: string
    }>>('/patients/pre-triages/todas')

    if (Array.isArray(remotas)) {
      const mapa = new Map<string, PreTriagem>()
      for (const r of remotas) {
        if (removidos.has(r.id)) continue
        mapa.set(r.id, {
          id: r.id,
          criadaEm: r.criadoEm ? new Date(r.criadoEm).getTime() : Date.now(),
          queixa: r.queixa,
          alerta: r.alerta,
          respostas: [],
          idade: r.idade,
          peso: r.peso,
          urgencia: r.urgencia,
          redFlags: r.redFlags,
          tabelaMarkdown: r.tabelaMarkdown,
          status: r.status,
        })
      }
      for (const l of locais) {
        if (!removidos.has(l.id) && !mapa.has(l.id)) {
          mapa.set(l.id, l)
        }
      }
      return Array.from(mapa.values()).sort((a, b) => b.criadaEm - a.criadaEm)
    }
  } catch {
    // Retorna locais se API indisponível
  }
  return locais
}

export async function removerPreTriagem(idPreTriagem: string): Promise<void> {
  registrarIdsRemovidos([idPreTriagem])

  const limparStorage = (storage: Storage) => {
    try {
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i)
        if (k?.startsWith('triageai:paciente:')) {
          const item = storage.getItem(k)
          if (item) {
            const parsed = JSON.parse(item) as DadosPaciente
            if (parsed?.preTriagens?.some((pt) => pt.id === idPreTriagem)) {
              const novas = parsed.preTriagens.filter((pt) => pt.id !== idPreTriagem)
              const atualizado: DadosPaciente = {
                ...parsed,
                etapa: novas.length === 0 && parsed.etapa === 'pre_triagem' ? 'nenhuma' : parsed.etapa,
                preTriagens: novas,
              }
              storage.setItem(k, JSON.stringify(atualizado))
            }
          }
        }
      }
    } catch { /* ignora */ }
  }

  limparStorage(localStorage)
  limparStorage(sessionStorage)

  try {
    await apiFetch(`/patients/pre-triage/${encodeURIComponent(idPreTriagem)}`, {
      method: 'DELETE',
    })
  } catch {
    // Mesmo sem rede, já foi removido localmente e marcado como excluído
  }

  window.dispatchEvent(new CustomEvent('triageai:pre-triagem-atualizada', { detail: { removida: idPreTriagem } }))
}

export async function limparTodasPreTriagens(idsAtuais: string[] = []): Promise<void> {
  if (idsAtuais.length > 0) {
    registrarIdsRemovidos(idsAtuais)
  }

  const zerarStorage = (storage: Storage) => {
    try {
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i)
        if (k?.startsWith('triageai:paciente:')) {
          const item = storage.getItem(k)
          if (item) {
            const parsed = JSON.parse(item) as DadosPaciente
            if (parsed?.preTriagens?.length) {
              registrarIdsRemovidos(parsed.preTriagens.map((p) => p.id))
              const atualizado: DadosPaciente = {
                ...parsed,
                etapa: parsed.etapa === 'pre_triagem' ? 'nenhuma' : parsed.etapa,
                preTriagens: [],
              }
              storage.setItem(k, JSON.stringify(atualizado))
            }
          }
        }
      }
    } catch { /* ignora */ }
  }

  zerarStorage(localStorage)
  zerarStorage(sessionStorage)

  try {
    await apiFetch('/patients/pre-triages/todas', { method: 'DELETE' })
  } catch { /* ignora */ }

  window.dispatchEvent(new CustomEvent('triageai:pre-triagem-atualizada'))
}

export function simularEtapa(id: string, etapa: EtapaAtendimento): DadosPaciente {
  const atual = carregarPaciente(id)
  return gravar(id, { ...atual, etapa, posicao: etapa === 'fila' ? 4 : 0 })
}

export function avancarFila(id: string): DadosPaciente {
  const atual = carregarPaciente(id)
  return gravar(id, { ...atual, posicao: Math.max(0, atual.posicao - 1) })
}
