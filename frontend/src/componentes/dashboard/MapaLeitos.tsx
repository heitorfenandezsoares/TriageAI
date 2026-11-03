import { useState } from 'react'
import type { Leito, SetorLeito, StatusLeito } from '../../dados/tipos'
import { apiFetch } from '../../api'
import { useIdioma } from '../../i18n/idioma'

const SETORES: SetorLeito[] = ['enfermaria', 'uti', 'observacao']
const STATUS: StatusLeito[] = ['ocupado', 'disponivel', 'limpeza', 'reservado']

interface MapaLeitosProps {
  leitos: Leito[]
  onAtualizar?: () => void
}

export default function MapaLeitos({ leitos: leitosIniciais, onAtualizar }: MapaLeitosProps) {
  const { t } = useIdioma()
  const d = t.dashboard.leitos

  const [leitosLocais, setLeitosLocais] = useState<Leito[]>(leitosIniciais)
  const [leitoSelecionado, setLeitoSelecionado] = useState<Leito | null>(null)
  const [filtroSetor, setFiltroSetor] = useState<SetorLeito | 'todos'>('todos')
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)

  // Sincroniza se a prop mudar
  const leitos = leitosLocais.length === leitosIniciais.length ? leitosLocais : leitosIniciais

  const alterarStatusLeito = async (id: string, novoStatus: StatusLeito) => {
    // Atualização otimista imediata na UI
    setLeitosLocais((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: novoStatus } : l))
    )

    if (leitoSelecionado?.id === id) {
      setLeitoSelecionado((prev) => (prev ? { ...prev, status: novoStatus } : null))
    }

    try {
      await apiFetch(`/beds/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: novoStatus }),
      })
      setMensagemSucesso(`Leito ${id} alterado para "${d.status[novoStatus]}"`)
      setTimeout(() => setMensagemSucesso(null), 3000)
      onAtualizar?.()
    } catch {
      // Ignora falha de rede
    }
  }

  const setoresVisiveis = filtroSetor === 'todos' ? SETORES : [filtroSetor]

  const totalGeral = leitos.length
  const ocupadosGeral = leitos.filter((l) => l.status === 'ocupado').length
  const livresGeral = leitos.filter((l) => l.status === 'disponivel').length
  const limpezaGeral = leitos.filter((l) => l.status === 'limpeza').length
  const taxaOcupacao = totalGeral > 0 ? Math.round((ocupadosGeral / totalGeral) * 100) : 0

  return (
    <section className="db-bloco" aria-labelledby="h-leitos">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <div>
          <h2 id="h-leitos" style={{ margin: 0 }}>{d.titulo}</h2>
          <span style={{ fontSize: '0.85rem', color: '#556980' }}>
            Ocupação global: <strong>{taxaOcupacao}%</strong> ({ocupadosGeral}/{totalGeral} leitos) · {livresGeral} livres · {limpezaGeral} em limpeza
          </span>
        </div>

        {/* Filtros por Setor */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            className={`btn btn-sm ${filtroSetor === 'todos' ? 'btn-cheio' : 'btn-contorno'}`}
            style={{ padding: '3px 8px', fontSize: '0.8rem' }}
            onClick={() => setFiltroSetor('todos')}
          >
            Todos
          </button>
          {SETORES.map((s) => (
            <button
              key={s}
              type="button"
              className={`btn btn-sm ${filtroSetor === s ? 'btn-cheio' : 'btn-contorno'}`}
              style={{ padding: '3px 8px', fontSize: '0.8rem' }}
              onClick={() => setFiltroSetor(s)}
            >
              {d.setores[s]}
            </button>
          ))}
        </div>
      </div>

      {mensagemSucesso && (
        <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '10px', fontSize: '0.9rem' }}>
          ✓ {mensagemSucesso}
        </div>
      )}

      {/* Grade de Setores e Leitos */}
      {setoresVisiveis.map((setor) => {
        const doSetor = leitos.filter((l) => l.setor === setor)
        const ocupados = doSetor.filter((l) => l.status === 'ocupado').length
        return (
          <div key={setor} className="db-setor" style={{ marginBottom: '14px' }}>
            <h3>
              {d.setores[setor]}{' '}
              <span>
                {ocupados}/{doSetor.length} {d.ocupacao}
              </span>
            </h3>

            <ul className="leitos-grade">
              {doSetor.map((l) => (
                <li
                  key={l.id}
                  className={`leito leito-${l.status}`}
                  aria-label={`${l.id}: ${d.status[l.status]}`}
                  title={`Clique para alterar o status do Leito ${l.id} (${d.status[l.status]})`}
                  style={{ cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                  onClick={() => setLeitoSelecionado(l)}
                >
                  {l.id}
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      {/* Painel / Modal de Gerenciamento do Leito Selecionado */}
      {leitoSelecionado && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '12px',
          marginBottom: '12px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>
                🛏️ Leito {leitoSelecionado.id} · Setor: {d.setores[leitoSelecionado.setor]}
              </strong>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                Status atual: <span className={`badge leito-${leitoSelecionado.status}`}>{d.status[leitoSelecionado.status]}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-contorno btn-sm"
              onClick={() => setLeitoSelecionado(null)}
            >
              ✕ Fechar
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#22c55e', color: '#fff', border: 'none' }}
              onClick={() => alterarStatusLeito(leitoSelecionado.id, 'disponivel')}
            >
              🟢 Marcar como Disponível
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#ef4444', color: '#fff', border: 'none' }}
              onClick={() => alterarStatusLeito(leitoSelecionado.id, 'ocupado')}
            >
              🔴 Marcar como Ocupado
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#eab308', color: '#fff', border: 'none' }}
              onClick={() => alterarStatusLeito(leitoSelecionado.id, 'limpeza')}
            >
              🟡 Enviar para Higienização
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#8b5cf6', color: '#fff', border: 'none' }}
              onClick={() => alterarStatusLeito(leitoSelecionado.id, 'reservado')}
            >
              🟣 Reservar Leito
            </button>
          </div>
        </div>
      )}

      {/* Legenda de Status */}
      <ul className="leitos-legenda">
        {STATUS.map((s) => (
          <li key={s}>
            <span className={`leito-amostra leito-${s}`} aria-hidden="true" /> {d.status[s]}
          </li>
        ))}
      </ul>
    </section>
  )
}
