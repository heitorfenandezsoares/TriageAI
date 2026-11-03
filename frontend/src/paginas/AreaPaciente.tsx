import { useEffect, useState } from 'react'
import CabecalhoArea from '../componentes/CabecalhoArea'
import Entrevista from './Entrevista'
import { useAuth } from '../auth/AuthContext'
import {
  avancarFila, carregarPaciente, carregarPacienteAsync, idPaciente, simularEtapa,
  type DadosPaciente, type EtapaAtendimento, type PreTriagem,
} from '../dados/paciente'
import { useIdioma } from '../i18n/idioma'

const INDICE: Record<EtapaAtendimento, number> = { nenhuma: 0, pre_triagem: 1, chegada: 2, fila: 3 }

type AbaPaciente = 'status' | 'entrevista' | 'historico'

export default function AreaPaciente() {
  const { sessao } = useAuth()
  const { lang, t } = useIdioma()
  const id = sessao ? idPaciente(sessao.usuario) : ''
  const [dados, setDados] = useState<DadosPaciente>(() => carregarPaciente(id))
  const [abaAtiva, setAbaAtiva] = useState<AbaPaciente>('status')
  const [modoFoco, setModoFoco] = useState(false)
  const [detalhePt, setDetalhePt] = useState<PreTriagem | null>(null)

  // Sincroniza dados com backend e localStorage ao montar e ao trocar de aba
  useEffect(() => {
    if (!id) return
    let ativo = true
    // Atualiza imediatamente do local
    setDados(carregarPaciente(id))

    // Carrega do backend se disponível
    carregarPacienteAsync(id, sessao?.usuario.nome).then((atualizados) => {
      if (ativo) setDados(atualizados)
    })

    // Escuta evento emitido sempre que uma nova pré-triagem é finalizada
    const aoAtualizar = () => {
      setDados(carregarPaciente(id))
      carregarPacienteAsync(id, sessao?.usuario.nome).then((atualizados) => {
        if (ativo) setDados(atualizados)
      })
    }

    window.addEventListener('triageai:pre-triagem-atualizada', aoAtualizar)
    return () => {
      ativo = false
      window.removeEventListener('triageai:pre-triagem-atualizada', aoAtualizar)
    }
  }, [id, abaAtiva, sessao?.usuario.nome])

  if (!sessao) return null
  const a = t.areaPaciente
  const e = t.entrevista
  const atual = INDICE[dados.etapa]
  const data = (ms: number) => new Date(ms).toLocaleString(lang === 'pt' ? 'pt-BR' : lang, { dateStyle: 'short', timeStyle: 'short' })

  const aoConcluirEntrevista = () => {
    setDados(carregarPaciente(id))
    setAbaAtiva('historico')
    setModoFoco(false)
  }

  return (
    <div className={`area ${modoFoco ? 'modo-foco-ativo' : ''}`}>
      {!modoFoco && <CabecalhoArea />}
      <main className="ar-conteudo ap">
        {/* Cabeçalho do perfil do paciente */}
        <header className="ap-paciente-header">
          <div className="ap-paciente-info">
            <h1>{t.area.ola}, {sessao.usuario.nome}</h1>
            <span className="ap-paciente-codigo">{sessao.usuario.contato ?? sessao.usuario.nome}</span>
          </div>

          <div className="ap-badges-status">
            {dados.etapa === 'nenhuma' && (
              <span className="badge badge-alerta">⚠️ Triagem pendente</span>
            )}
            {dados.etapa === 'pre_triagem' && (
              <span className="badge badge-sucesso">✓ {a.etapas[0]}</span>
            )}
            {dados.etapa === 'chegada' && (
              <span className="badge badge-info">🏥 {a.etapas[1]}</span>
            )}
            {dados.etapa === 'fila' && (
              <span className="badge badge-alerta">⏳ {a.etapas[2]}</span>
            )}
          </div>
        </header>

        {/* Barra de Abas */}
        {!modoFoco && (
          <nav className="ap-tabs-nav" role="tablist" aria-label="Navegação da área do paciente">
            <button
              type="button"
              role="tab"
              aria-selected={abaAtiva === 'status'}
              aria-controls="painel-status"
              id="tab-status"
              className={`tab-btn ${abaAtiva === 'status' ? 'ativo' : ''}`}
              onClick={() => setAbaAtiva('status')}
            >
              📋 {a.statusTitulo}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={abaAtiva === 'entrevista'}
              aria-controls="painel-entrevista"
              id="tab-entrevista"
              className={`tab-btn ${abaAtiva === 'entrevista' ? 'ativo' : ''}`}
              onClick={() => setAbaAtiva('entrevista')}
            >
              🩺 {e.titulo}
              {dados.etapa === 'nenhuma' && <span className="tab-ponto-alerta" aria-hidden="true" />}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={abaAtiva === 'historico'}
              aria-controls="painel-historico"
              id="tab-historico"
              className={`tab-btn ${abaAtiva === 'historico' ? 'ativo' : ''}`}
              onClick={() => setAbaAtiva('historico')}
            >
              🕒 {a.historicoTitulo} ({dados.preTriagens.length})
            </button>
          </nav>
        )}

        {/* ABA: STATUS / ACOMPANHAMENTO */}
        {abaAtiva === 'status' && (
          <div id="painel-status" role="tabpanel" aria-labelledby="tab-status" className="ap-painel-aba">
            {dados.etapa === 'nenhuma' && (
              <div className="card-atencao-triagem">
                <div className="card-atencao-texto">
                  <h3>{a.cta}</h3>
                  <p>{a.descricoes.nenhuma}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-cheio btn-grande"
                  onClick={() => setAbaAtiva('entrevista')}
                >
                  {a.cta} →
                </button>
              </div>
            )}

            <section className="db-bloco" aria-labelledby="h-status">
              <h2 id="h-status">{a.statusTitulo}</h2>
              <ol className="ap-etapas">
                {a.etapas.map((rotulo, i) => (
                  <li key={rotulo} className={i + 1 < atual ? 'feito' : i + 1 === atual ? 'atual' : undefined}
                    aria-current={i + 1 === atual ? 'step' : undefined}>
                    <span className="ap-marca" aria-hidden="true">{i + 1 < atual ? '✓' : i + 1}</span>
                    {rotulo}
                  </li>
                ))}
              </ol>
              <p className="ap-desc">{a.descricoes[dados.etapa]}</p>

              {dados.etapa === 'fila' && (
                <div className="ap-fila" role="status">
                  {dados.posicao === 0 ? (
                    <p className="ap-posicao">{a.minhaVez}</p>
                  ) : (
                    <>
                      <p className="ap-posicao">{a.posicao.replace('{n}', String(dados.posicao))}</p>
                      <p>{a.aFrente.replace('{n}', String(dados.posicao - 1))}</p>
                    </>
                  )}
                  <p className="ap-nota">{a.avisoFila}</p>
                </div>
              )}
              <p className="ap-nota">{a.confirmaHospital}</p>
            </section>
          </div>
        )}

        {/* ABA: ENTREVISTA */}
        {abaAtiva === 'entrevista' && (
          <div id="painel-entrevista" role="tabpanel" aria-labelledby="tab-entrevista" className="ap-painel-aba">
            <div className="entrevista-header-bar">
              <div>
                <h2>{e.titulo}</h2>
                <p className="ap-nota">{e.sub}</p>
              </div>
              <button
                type="button"
                className="btn btn-contorno btn-sm"
                onClick={() => setModoFoco(!modoFoco)}
              >
                {modoFoco ? '🗗 Sair do Modo Foco' : '⛶ Modo Foco'}
              </button>
            </div>

            <div className="entrevista-incorporada">
              <Entrevista embutido aoConcluir={aoConcluirEntrevista} />
            </div>
          </div>
        )}

        {/* ABA: HISTÓRICO */}
        {abaAtiva === 'historico' && (
          <div id="painel-historico" role="tabpanel" aria-labelledby="tab-historico" className="ap-painel-aba">
            <section className="db-bloco" aria-labelledby="h-hist">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 id="h-hist">{a.historicoTitulo} ({dados.preTriagens.length})</h2>
                <button
                  type="button"
                  className="btn btn-contorno btn-sm"
                  onClick={() => carregarPacienteAsync(id, sessao?.usuario.nome).then(setDados)}
                >
                  🔄 Atualizar
                </button>
              </div>

              {dados.preTriagens.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: '#556980' }}>
                  <p>{a.historicoVazio}</p>
                  <button
                    type="button"
                    className="btn btn-cheio btn-sm"
                    style={{ marginTop: 12 }}
                    onClick={() => setAbaAtiva('entrevista')}
                  >
                    🩺 Iniciar Pré-Triagem Agora
                  </button>
                </div>
              ) : (
                <ul className="ap-historico">
                  {dados.preTriagens.map((p) => (
                    <li
                      key={p.id}
                      style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onClick={() => setDetalhePt(detalhePt?.id === p.id ? null : p)}
                      title="Clique para ver o resumo completo"
                    >
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '1.05rem' }}>{p.queixa}</strong>
                        {p.idade && p.peso && (
                          <small style={{ display: 'block', color: '#556980', marginTop: 4 }}>
                            Idade: {p.idade} • Peso: {p.peso} • Urgência: {p.urgencia ?? (p.alerta ? 'Alto' : 'Baixo')}
                          </small>
                        )}
                        <time style={{ display: 'block', marginTop: 4, fontSize: '0.82rem', color: '#64748b' }} dateTime={new Date(p.criadaEm).toISOString()}>
                          {data(p.criadaEm)} {p.status ? `• Status: ${p.status === 'em_fila' ? '✅ Admitido na Fila' : '⏳ Aguardando Recepção'}` : ''}
                        </time>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                        {p.alerta ? (
                          <span className="ap-tag-alerta">⚠️ {p.urgencia ? `Urgência ${p.urgencia}` : a.alertaTag}</span>
                        ) : (
                          <span className={`badge ${p.urgencia === 'Médio' ? 'badge-info' : 'badge-sucesso'}`}>
                            Urgência {p.urgencia ?? 'Baixo'}
                          </span>
                        )}
                        <span style={{ fontSize: '0.78rem', color: '#2563eb', fontWeight: 600 }}>
                          {detalhePt?.id === p.id ? 'Ocultar detalhes ▲' : 'Ver detalhes ▼'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Modal / Card expandido com detalhes da pré-triagem */}
              {detalhePt && (
                <div style={{ marginTop: 16, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>📋 Resumo Clínico da Pré-Triagem</h3>
                    <button type="button" className="btn btn-contorno btn-sm" onClick={() => setDetalhePt(null)}>✕ Fechar</button>
                  </div>

                  <table className="tabela-triagem" style={{ width: '100%', marginBottom: 12 }}>
                    <tbody>
                      <tr><td><strong>Idade</strong></td><td>{detalhePt.idade || 'Não informada'}</td></tr>
                      <tr><td><strong>Peso</strong></td><td>{detalhePt.peso || 'Não informado'}</td></tr>
                      <tr><td><strong>Sintomas</strong></td><td>{detalhePt.queixa}</td></tr>
                      <tr><td><strong>Sinais de Alerta</strong></td><td>{detalhePt.redFlags || (detalhePt.alerta ? 'Sim' : 'Não')}</td></tr>
                      <tr><td><strong>Nível de Urgência</strong></td><td>{detalhePt.urgencia || (detalhePt.alerta ? 'Alto' : 'Baixo')}</td></tr>
                    </tbody>
                  </table>

                  {detalhePt.tabelaMarkdown && (
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#475569' }}>Visualizar formato Markdown para prontuário</summary>
                      <pre style={{ background: '#e2e8f0', padding: 8, borderRadius: 4, fontSize: '0.8rem', whiteSpace: 'pre-wrap', marginTop: 4 }}>
                        {detalhePt.tabelaMarkdown}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </section>
          </div>
        )}

        {!modoFoco && <p className="ap-nota">{a.privacidade}</p>}

        {import.meta.env.DEV && !modoFoco && (
          <section className="db-bloco ap-sim" aria-label="Simulação">
            <h2>Simulação (só em desenvolvimento)</h2>
            <p className="ap-nota">Em produção, a equipe do hospital muda estas etapas.</p>
            <div className="ent-acoes">
              <button type="button" className="btn btn-contorno" onClick={() => setDados(simularEtapa(id, 'chegada'))}>Chegada ao hospital</button>
              <button type="button" className="btn btn-contorno" onClick={() => setDados(simularEtapa(id, 'fila'))}>Triagem feita (entrar na fila)</button>
              <button type="button" className="btn btn-contorno" onClick={() => setDados(avancarFila(id))}>Avançar a fila</button>
              <button type="button" className="btn btn-contorno" onClick={() => setDados(simularEtapa(id, 'pre_triagem'))}>Voltar a "pré-triagem enviada"</button>
              <button type="button" className="btn btn-contorno" onClick={() => setDados(simularEtapa(id, 'nenhuma'))}>Resetar para "sem pré-triagem"</button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
