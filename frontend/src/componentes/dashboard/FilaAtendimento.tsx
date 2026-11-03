import { useState } from 'react'
import { ALVO_MIN, ORDEM_NIVEL } from '../../dados/manchester'
import type { PacienteFila, NivelManchester } from '../../dados/tipos'
import { apiFetch } from '../../api'
import { useIdioma } from '../../i18n/idioma'

interface FilaProps {
  fila: PacienteFila[]
  onAtualizar?: () => void
}

export default function FilaAtendimento({ fila, onAtualizar }: FilaProps) {
  const { t } = useIdioma()
  const d = t.dashboard
  const [pacienteChamado, setPacienteChamado] = useState<PacienteFila | null>(null)
  const [modalAdmitir, setModalAdmitir] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [idsRemovidos, setIdsRemovidos] = useState<Set<number>>(new Set())

  // Form de admissão rápida
  const [novoIni, setNovoIni] = useState('')
  const [novaIdade, setNovaIdade] = useState('')
  const [novaQueixa, setNovaQueixa] = useState('0')
  const [novoNivel, setNovoNivel] = useState<NivelManchester>('verde')

  const filaVisivel = fila.filter((p) => !idsRemovidos.has(p.id))
  const ordenada = [...filaVisivel].sort((a, b) => ORDEM_NIVEL[a.nivel] - ORDEM_NIVEL[b.nivel] || b.espera - a.espera)

  // Toca um sinal sonoro de chamada de painel hospitalar via Web Audio API
  const tocarSinalChamada = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime) // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15) // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6)

      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.6)
    } catch {
      // Ignora erro de autoplay se bloqueado pelo navegador
    }
  }

  // Chamar o próximo paciente segundo a ordem de prioridade de Manchester
  const chamarProximo = async () => {
    if (ordenada.length === 0) return
    const proximo = ordenada[0]
    setPacienteChamado(proximo)
    tocarSinalChamada()

    try {
      await apiFetch('/patients/chamar-proximo', { method: 'POST' })
    } catch {
      // continua localmente
    }
  }

  // Finalizar atendimento / remover da fila
  const concluirAtendimento = async (id: number) => {
    setIdsRemovidos((prev) => new Set(prev).add(id))
    if (pacienteChamado?.id === id) setPacienteChamado(null)
    setMensagemSucesso('Paciente removido / atendimento concluído!')
    setTimeout(() => setMensagemSucesso(null), 3000)

    try {
      await apiFetch(`/patients/${id}`, { method: 'DELETE' })
      window.dispatchEvent(new CustomEvent('triageai:fila-atualizada'))
      onAtualizar?.()
    } catch {
      // Tratamento silencioso
    }
  }

  // Limpar toda a fila de atendimento
  const limparFilaCompleta = async () => {
    const idsAtuais = ordenada.map((p) => p.id)
    setIdsRemovidos((prev) => {
      const novo = new Set(prev)
      idsAtuais.forEach((id) => novo.add(id))
      return novo
    })
    setPacienteChamado(null)
    setMensagemSucesso('Fila de atendimento limpa com sucesso!')
    setTimeout(() => setMensagemSucesso(null), 3000)

    try {
      await apiFetch('/patients/limpar-fila', { method: 'DELETE' }).catch(async () => {
        await Promise.all(idsAtuais.map((id) => apiFetch(`/patients/${id}`, { method: 'DELETE' })))
      })
      window.dispatchEvent(new CustomEvent('triageai:fila-atualizada'))
      onAtualizar?.()
    } catch {
      // Ignora erro
    }
  }

  // Admissão manual presencial direta na fila
  const submeterNovoPaciente = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!novoIni.trim() || !novaIdade) return

    const idadeNum = parseInt(novaIdade, 10) || 30
    const qNum = parseInt(novaQueixa, 10) || 0

    try {
      await apiFetch('/patients', {
        method: 'POST',
        body: JSON.stringify({
          ini: novoIni.trim().toUpperCase(),
          idade: idadeNum,
          q: qNum,
          nivel: novoNivel,
          espera: 0,
          risco: novoNivel === 'vermelho' ? 1.0 : novoNivel === 'laranja' ? 0.8 : novoNivel === 'amarelo' ? 0.5 : 0.1,
        }),
      })

      setNovoIni('')
      setNovaIdade('')
      setModalAdmitir(false)
      setMensagemSucesso('Paciente inserido na fila de atendimento!')
      setTimeout(() => setMensagemSucesso(null), 3000)
      window.dispatchEvent(new CustomEvent('triageai:fila-atualizada'))
      onAtualizar?.()
    } catch {
      alert('Não foi possível conectar ao servidor para admitir o paciente.')
    }
  }

  return (
    <section className="db-bloco" aria-labelledby="h-fila">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h2 id="h-fila" style={{ margin: 0 }}>{d.fila.titulo}</h2>
          <span style={{ fontSize: '0.85rem', color: '#556980' }}>
            {ordenada.length} paciente{ordenada.length !== 1 ? 's' : ''} em espera prioritária
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-cheio btn-sm"
            onClick={chamarProximo}
            disabled={ordenada.length === 0}
            title="Chama o primeiro da fila respeitando o Protocolo de Manchester"
          >
            🔔 Chamar Próximo
          </button>
          <button
            type="button"
            className="btn btn-contorno btn-sm"
            onClick={() => setModalAdmitir(true)}
          >
            + Admitir
          </button>
          {ordenada.length > 0 && (
            <button
              type="button"
              className="btn btn-contorno btn-sm"
              style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              onClick={limparFilaCompleta}
              title="Remover todos os pacientes da fila"
            >
              🗑️ Limpar Fila
            </button>
          )}
        </div>
      </div>

      {mensagemSucesso && (
        <div style={{ padding: '8px 12px', background: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '10px', fontSize: '0.9rem' }}>
          ✓ {mensagemSucesso}
        </div>
      )}

      {/* Alerta de Paciente Sendo Chamado no Painel */}
      {pacienteChamado && (
        <div style={{
          background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
          color: '#ffffff',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              📢 Paciente em Atendimento no Consultório
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '2px' }}>
              {pacienteChamado.ini} ({pacienteChamado.idade} {t.painel.anos}) · {t.painel.niveis[pacienteChamado.nivel][0]}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              Queixa: {t.painel.queixas[pacienteChamado.q]}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: '#22c55e', color: '#fff', border: 'none' }}
              onClick={() => concluirAtendimento(pacienteChamado.id)}
            >
              ✓ Concluir
            </button>
            <button
              type="button"
              className="btn btn-sm btn-contorno"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}
              onClick={() => setPacienteChamado(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Modal de Admissão Rápida */}
      {modalAdmitir && (
        <div style={{
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid #cbd5e1',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>➕ Admitir Novo Paciente na Fila</h3>
            <button type="button" className="btn btn-contorno btn-sm" onClick={() => setModalAdmitir(false)}>✕</button>
          </div>
          <form onSubmit={submeterNovoPaciente} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Iniciais</label>
              <input
                type="text"
                value={novoIni}
                placeholder="Ex: A.S."
                maxLength={8}
                required
                onChange={(e) => setNovoIni(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Idade</label>
              <input
                type="number"
                value={novaIdade}
                placeholder="Ex: 45"
                min={0}
                max={120}
                required
                onChange={(e) => setNovaIdade(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Classificação Manchester</label>
              <select
                value={novoNivel}
                onChange={(e) => setNovoNivel(e.target.value as NivelManchester)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                <option value="vermelho">🔴 Vermelho (Emergência - 0 min)</option>
                <option value="laranja">🟠 Laranja (Muito Urgente - 10 min)</option>
                <option value="amarelo">🟡 Amarelo (Urgente - 60 min)</option>
                <option value="verde">🟢 Verde (Pouco Urgente - 120 min)</option>
                <option value="azul">🔵 Azul (Não Urgente - 240 min)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>Queixa Principal</label>
              <select
                value={novaQueixa}
                onChange={(e) => setNovaQueixa(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
              >
                {t.painel.queixas.map((q, idx) => (
                  <option key={idx} value={idx}>{q}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button type="button" className="btn btn-contorno btn-sm" onClick={() => setModalAdmitir(false)}>Cancelar</button>
              <button type="submit" className="btn btn-cheio btn-sm">Confirmar Admissão</button>
            </div>
          </form>
        </div>
      )}

      {/* Lista da Fila Ordenada */}
      {ordenada.length === 0 ? (
        <p>{d.fila.vazio}</p>
      ) : (
        <ol className="db-fila">
          {ordenada.map((p, i) => {
            const excedido = p.espera > ALVO_MIN[p.nivel]
            return (
              <li key={p.id} className={`db-pac nivel-${p.nivel}`}>
                <span className="posicao">{i + 1}º</span>
                <span className="dados">
                  <strong>{p.ini}, {p.idade} {t.painel.anos}</strong>
                  <span>{t.painel.queixas[p.q]}</span>
                </span>
                <span className={`db-espera${excedido ? ' excedido' : ''}`}>
                  {p.espera} {d.min}{excedido && ` · ${d.excedido}`}
                </span>
                <span className="selo">{t.painel.niveis[p.nivel][0]}</span>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn btn-contorno btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                    onClick={() => {
                      setPacienteChamado(p)
                      tocarSinalChamada()
                    }}
                    title="Chamar este paciente"
                  >
                    📢 Chamar
                  </button>
                  <button
                    type="button"
                    className="btn btn-contorno btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.75rem', color: '#16a34a', borderColor: '#86efac' }}
                    onClick={() => concluirAtendimento(p.id)}
                    title="Concluir atendimento"
                  >
                    ✓ Atendido
                  </button>
                  <button
                    type="button"
                    className="btn btn-contorno btn-sm"
                    style={{ padding: '2px 8px', fontSize: '0.75rem', color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={() => concluirAtendimento(p.id)}
                    title="Remover paciente da fila"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
