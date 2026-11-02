import { useState } from 'react'
import CabecalhoArea from '../componentes/CabecalhoArea'
import Entrevista from './Entrevista'
import { useAuth } from '../auth/AuthContext'
import {
  avancarFila, carregarPaciente, idPaciente, simularEtapa,
  type DadosPaciente, type EtapaAtendimento,
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

  if (!sessao) return null
  const a = t.areaPaciente
  const e = t.entrevista
  const atual = INDICE[dados.etapa]
  const data = (ms: number) => new Date(ms).toLocaleString(lang === 'pt' ? 'pt-BR' : lang, { dateStyle: 'short', timeStyle: 'short' })

  const aoConcluirEntrevista = () => {
    setDados(carregarPaciente(id))
    setAbaAtiva('status')
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
              <h2 id="h-hist">{a.historicoTitulo}</h2>
              {dados.preTriagens.length === 0 ? (
                <p>{a.historicoVazio}</p>
              ) : (
                <ul className="ap-historico">
                  {dados.preTriagens.map((p) => (
                    <li key={p.id}>
                      <span>
                        <strong>{p.queixa}</strong>
                        {p.idade && p.peso && (
                          <small style={{ display: 'block', color: '#556980', marginTop: 4 }}>
                            {p.idade} • {p.peso} • Urgência: {p.urgencia ?? (p.alerta ? 'Alto' : 'Baixo')}
                          </small>
                        )}
                        <br />
                        <time dateTime={new Date(p.criadaEm).toISOString()}>{data(p.criadaEm)}</time>
                      </span>
                      {p.alerta ? (
                        <span className="ap-tag-alerta">⚠️ {p.urgencia ? `Urgência ${p.urgencia}` : a.alertaTag}</span>
                      ) : (
                        <span className="badge badge-sucesso">Urgência {p.urgencia ?? 'Baixo'}</span>
                      )}
                    </li>
                  ))}
                </ul>
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
