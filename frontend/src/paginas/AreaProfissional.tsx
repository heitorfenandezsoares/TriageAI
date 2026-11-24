import { useEffect, useState } from 'react'
import CabecalhoArea from '../componentes/CabecalhoArea'
import SalaVideoTriagem, { extrairCodigoSala } from '../componentes/SalaVideoTriagem'
import Entrevista from './Entrevista'
import FilaAtendimento from '../componentes/dashboard/FilaAtendimento'
import MapaLeitos from '../componentes/dashboard/MapaLeitos'
import Indicadores from '../componentes/dashboard/Indicadores'
import Alertas from '../componentes/dashboard/Alertas'
import { useAuth } from '../auth/AuthContext'
import { MODULOS_POR_PERFIL } from '../auth/permissoes'
import { useDadosTempoReal } from '../dados/useDadosTempoReal'
import {
  carregarTodasPreTriagens,
  carregarTodasPreTriagensAsync,
  removerPreTriagem,
  limparTodasPreTriagens,
  type PreTriagem,
} from '../dados/paciente'
import { apiFetch } from '../api'
import { useIdioma } from '../i18n/idioma'

type AbaProfissional = 'visaoGeral' | 'preTriagens' | 'entrevistaOnline' | 'leitos' | 'indicadores'

export default function AreaProfissional() {
  const { sessao } = useAuth()
  const { lang, t } = useIdioma()
  const [abaAtiva, setAbaAtiva] = useState<AbaProfissional>('visaoGeral')
  const [preTriagens, setPreTriagens] = useState<PreTriagem[]>(() => carregarTodasPreTriagens())
  const [preTriagemSelecionada, setPreTriagemSelecionada] = useState<PreTriagem | null>(null)
  const [chamadaAtiva, setChamadaAtiva] = useState<{ idSala: string; nomePaciente: string } | null>(null)
  const [modoEntrevista, setModoEntrevista] = useState<'video' | 'digital' | 'fila'>('video')
  const [idSalaManual, setIdSalaManual] = useState(() => `Tele-Gestor-${Math.floor(1000 + Math.random() * 9000)}`)
  const [copiado, setCopiado] = useState(false)

  const modulos: readonly string[] = sessao ? MODULOS_POR_PERFIL[sessao.usuario.perfil] : []
  const dados = useDadosTempoReal({ leitos: modulos.includes('leitos') })

  const linkPaciente = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}#/entrevista?sala=${encodeURIComponent(idSalaManual.trim() || 'Tele-Gestor')}`
    : `#/entrevista?sala=${encodeURIComponent(idSalaManual.trim() || 'Tele-Gestor')}`

  const copiarLink = () => {
    navigator.clipboard.writeText(linkPaciente)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  const atualizarPreTriagens = () => {
    carregarTodasPreTriagensAsync().then(setPreTriagens)
  }

  useEffect(() => {
    atualizarPreTriagens()
    const aoAtualizar = () => atualizarPreTriagens()
    window.addEventListener('triageai:pre-triagem-atualizada', aoAtualizar)
    return () => window.removeEventListener('triageai:pre-triagem-atualizada', aoAtualizar)
  }, [])

  const admitirNaFila = async (id: string) => {
    try {
      await apiFetch(`/patients/pre-triage/${id}/admit`, { method: 'POST' })
      alert('Paciente admitido na fila de atendimento com sucesso!')
      atualizarPreTriagens()
      if (preTriagemSelecionada?.id === id) {
        setPreTriagemSelecionada((prev) => (prev ? { ...prev, status: 'em_fila' } : null))
      }
    } catch {
      alert('Não foi possível admitir o paciente na fila. Verifique a conexão com o servidor.')
    }
  }

  const excluirProntuario = async (id: string, ev?: React.MouseEvent) => {
    ev?.stopPropagation()
    setPreTriagens((prev) => prev.filter((p) => p.id !== id))
    if (preTriagemSelecionada?.id === id) {
      setPreTriagemSelecionada(null)
    }
    await removerPreTriagem(id)
  }

  const excluirTodosProntuarios = async () => {
    const ids = preTriagens.map((p) => p.id)
    setPreTriagens([])
    setPreTriagemSelecionada(null)
    await limparTodasPreTriagens(ids)
  }

  if (!sessao) return null

  const hora = new Date(dados.atualizadoEm).toLocaleTimeString(lang === 'pt' ? 'pt-BR' : lang)
  const perfil = sessao.usuario.perfil

  const rotuloPerfil: Record<string, string> = {
    enfermeiro: '🩺 Enfermeiro(a) Clínico · Triagem Manchester & Leitos',
    gestor: '📊 Gestor(a) Hospitalar · Ocupação & Indicadores',
    recepcionista: '📋 Recepção Geral · Triagem de Entrada & Fila',
  }

  return (
    <div className="area">
      <CabecalhoArea />
      <main className="ar-conteudo">
        {/* Cabeçalho Executivo do Profissional */}
        <header className="db-cabeca ap-prof-header">
          <div>
            <h1>{t.area.ola}, {sessao.usuario.nome}</h1>
            <p className="ap-prof-sub">
              <span className="badge badge-info">{rotuloPerfil[perfil] ?? perfil}</span>
              <span className="db-atualizado">{t.dashboard.atualizado} {hora}</span>
            </p>
          </div>

          <div className="db-acoes-topo">
            <button
              type="button"
              className="btn btn-cheio"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#2563eb',
                borderColor: '#2563eb',
                color: '#fff',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
              onClick={() => setAbaAtiva('entrevistaOnline')}
            >
              📹 Entrevista Online
            </button>
            {modulos.includes('triagem') && (
              <a className="btn btn-contorno" href="#/triagem">
                + {t.dashboard.novaTriagem}
              </a>
            )}
          </div>
        </header>

        {/* Abas de Navegação do Painel */}
        <nav className="ap-tabs-nav prof-tabs" role="tablist" aria-label="Navegação da área profissional">
          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === 'visaoGeral'}
            className={`tab-btn ${abaAtiva === 'visaoGeral' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('visaoGeral')}
          >
            📋 Painel Principal
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === 'preTriagens'}
            className={`tab-btn ${abaAtiva === 'preTriagens' ? 'ativo' : ''}`}
            onClick={() => {
              atualizarPreTriagens()
              setAbaAtiva('preTriagens')
            }}
          >
            🚨 Pré-Triagens Virtuais (Chatbot)
            {preTriagens.length > 0 && <span className="tab-badge-count">{preTriagens.length}</span>}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={abaAtiva === 'entrevistaOnline'}
            className={`tab-btn ${abaAtiva === 'entrevistaOnline' ? 'ativo' : ''}`}
            onClick={() => setAbaAtiva('entrevistaOnline')}
          >
            📹 Entrevista Online
          </button>

          {modulos.includes('leitos') && (
            <button
              type="button"
              role="tab"
              aria-selected={abaAtiva === 'leitos'}
              className={`tab-btn ${abaAtiva === 'leitos' ? 'ativo' : ''}`}
              onClick={() => setAbaAtiva('leitos')}
            >
              🛏️ Mapa de Leitos
            </button>
          )}

          {modulos.includes('indicadores') && (
            <button
              type="button"
              role="tab"
              aria-selected={abaAtiva === 'indicadores'}
              className={`tab-btn ${abaAtiva === 'indicadores' ? 'ativo' : ''}`}
              onClick={() => setAbaAtiva('indicadores')}
            >
              📊 Indicadores
            </button>
          )}
        </nav>

        {/* CONTEÚDO DAS ABAS */}

        {/* 1. VISÃO GERAL */}
        {abaAtiva === 'visaoGeral' && (
          <div className="prof-painel-aba">
            {modulos.includes('indicadores') && <Indicadores fila={dados.fila} leitos={dados.leitos} />}

            <div className="db-colunas">
              {modulos.includes('fila') && <FilaAtendimento fila={dados.fila} />}
              <div className="db-lateral">
                {modulos.includes('leitos') && <MapaLeitos leitos={dados.leitos} />}
                {modulos.includes('leitos') && <Alertas fila={dados.fila} />}
              </div>
            </div>
          </div>
        )}

        {/* 2. PRÉ-TRIAGENS RECEBIDAS (CHATBOT / APP) */}
        {abaAtiva === 'preTriagens' && (
          <section className="db-bloco prof-painel-aba" aria-labelledby="h-pretriagens">
            <div className="prof-pretriagens-header">
              <div>
                <h2 id="h-pretriagens">Pré-Triagens Virtuais Recebidas (Chatbot IA)</h2>
                <p className="ap-nota">
                  Casos preenchidos pelos pacientes via aplicativo ou totem antes do atendimento presencial.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="btn btn-contorno btn-sm" onClick={atualizarPreTriagens}>
                  🔄 Atualizar Lista
                </button>
                {preTriagens.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-contorno btn-sm"
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    onClick={excluirTodosProntuarios}
                    title="Remover todos os prontuários da lista"
                  >
                    🗑️ Limpar Todos
                  </button>
                )}
              </div>
            </div>

            {preTriagens.length === 0 ? (
              <div className="prof-vazio">
                <p>Nenhuma pré-triagem virtual registrada recentemente.</p>
                <small>Quando um paciente responder ao assistente de pré-triagem, o caso aparecerá aqui automaticamente.</small>
              </div>
            ) : (
              <div className="prof-grid-pretriagens">
                <div className="prof-lista-cards">
                  {preTriagens.map((pt) => {
                    const dataHora = new Date(pt.criadaEm).toLocaleString(lang === 'pt' ? 'pt-BR' : lang)
                    const selecionado = preTriagemSelecionada?.id === pt.id
                    const semAlertaGrave = !pt.alerta && (!pt.redFlags || pt.redFlags.startsWith('Não') || pt.redFlags.startsWith('Nenhum'))
                    return (
                      <div
                        key={pt.id}
                        className={`prof-card-pt ${pt.alerta ? 'card-alerta' : ''} ${selecionado ? 'ativo' : ''}`}
                        onClick={() => setPreTriagemSelecionada(pt)}
                      >
                        <div className="prof-card-topo">
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className={`badge ${pt.urgencia === 'Alto' || pt.alerta ? 'badge-alerta' : pt.urgencia === 'Médio' ? 'badge-info' : 'badge-sucesso'}`}>
                              {pt.urgencia ? `Urgência ${pt.urgencia}` : (pt.alerta ? '⚠️ Alerta' : '✓ Normal')}
                            </span>
                            {pt.status === 'em_fila' && (
                              <span className="badge badge-sucesso" style={{ fontSize: '0.72rem' }}>
                                ✓ Na Fila
                              </span>
                            )}
                          </div>
                          <time>{dataHora}</time>
                        </div>
                        <h3 className="prof-card-queixa">{pt.queixa || 'Sintomas não informados'}</h3>
                        <div className="prof-card-dados">
                          {pt.idade && <span>Idade: <strong>{pt.idade}</strong></span>}
                          {pt.peso && <span>Peso: <strong>{pt.peso}</strong></span>}
                        </div>
                        {pt.redFlags && (
                          semAlertaGrave ? (
                            <p style={{ margin: '8px 0 0', padding: '6px 10px', borderRadius: '6px', background: '#f0fdf4', color: '#15803d', fontSize: '0.82rem' }}>
                              ✓ Sem sinais de alerta críticos ({pt.redFlags})
                            </p>
                          ) : (
                            <p className="prof-card-redflags">
                              🚩 {pt.redFlags}
                            </p>
                          )
                        )}
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                          <button type="button" className="btn btn-contorno btn-sm" style={{ flex: 1 }}>
                            Ver Prontuário Completo →
                          </button>
                          <button
                            type="button"
                            className="btn btn-contorno btn-sm"
                            style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '6px 10px' }}
                            onClick={(ev) => excluirProntuario(pt.id, ev)}
                            title="Remover este prontuário"
                          >
                            🗑️ Remover
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Detalhes da Pré-Triagem Selecionada */}
                {preTriagemSelecionada && (
                  <div className="prof-detalhe-pt">
                    <div className="prof-detalhe-header">
                      <h3>Detalhes Clínicos do Paciente</h3>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-contorno btn-sm"
                          style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                          onClick={() => excluirProntuario(preTriagemSelecionada.id)}
                          title="Excluir este prontuário permanentemente"
                        >
                          🗑️ Remover Prontuário
                        </button>
                        <button
                          type="button"
                          className="btn btn-contorno btn-sm"
                          onClick={() => setPreTriagemSelecionada(null)}
                        >
                          ✕ Fechar
                        </button>
                      </div>
                    </div>

                    <table className="tabela-triagem">
                      <tbody>
                        <tr>
                          <td><strong>Data/Hora</strong></td>
                          <td>{new Date(preTriagemSelecionada.criadaEm).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td><strong>Idade</strong></td>
                          <td>{preTriagemSelecionada.idade || 'Não informada'}</td>
                        </tr>
                        <tr>
                          <td><strong>Peso</strong></td>
                          <td>{preTriagemSelecionada.peso || 'Não informado'}</td>
                        </tr>
                        <tr>
                          <td><strong>Queixa Principal</strong></td>
                          <td>{preTriagemSelecionada.queixa}</td>
                        </tr>
                        <tr>
                          <td><strong>Sinais de Alerta</strong></td>
                          <td className={preTriagemSelecionada.alerta ? 'texto-alerta' : ''}>
                            {preTriagemSelecionada.redFlags || (preTriagemSelecionada.alerta ? 'Sinais de risco identificados' : 'Nenhum sinal crítico')}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Nível de Urgência</strong></td>
                          <td>
                            <span className={`badge ${preTriagemSelecionada.urgencia === 'Alto' || preTriagemSelecionada.alerta ? 'badge-alerta' : 'badge-sucesso'}`}>
                              {preTriagemSelecionada.urgencia ?? (preTriagemSelecionada.alerta ? 'Alto' : 'Baixo')}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {preTriagemSelecionada.tabelaMarkdown && (
                      <div className="prof-markdown-box">
                        <small>Resumo Markdown enviado pelo assistente:</small>
                        <pre>{preTriagemSelecionada.tabelaMarkdown}</pre>
                      </div>
                    )}

                    <div className="prof-detalhe-acoes" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      {preTriagemSelecionada.status === 'em_fila' ? (
                        <span className="badge badge-sucesso" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                          ✓ Paciente já admitido na Fila Ativa
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-cheio"
                          style={{ background: '#059669', borderColor: '#059669' }}
                          onClick={() => admitirNaFila(preTriagemSelecionada.id)}
                        >
                          📥 Admitir Paciente na Fila do Hospital
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-contorno"
                        onClick={() =>
                          setChamadaAtiva({
                            idSala: preTriagemSelecionada.id,
                            nomePaciente: preTriagemSelecionada.queixa.slice(0, 20) || 'Paciente',
                          })
                        }
                      >
                        📹 Entrar em Sala de Vídeo
                      </button>
                      <a className="btn btn-contorno" href="#/triagem">
                        🩺 Iniciar Manchester Presencial
                      </a>
                      <button
                        type="button"
                        className="btn btn-contorno"
                        style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                        onClick={() => excluirProntuario(preTriagemSelecionada.id)}
                      >
                        🗑️ Excluir Prontuário
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* 3. ENTREVISTA ONLINE & TELE-TRIAGEM */}
        {abaAtiva === 'entrevistaOnline' && (
          <section className="db-bloco prof-painel-aba" aria-labelledby="h-entrevista-online">
            <div className="prof-pretriagens-header" style={{ marginBottom: 16 }}>
              <div>
                <h2 id="h-entrevista-online">📹 Central de Entrevista Online & Tele-Triagem</h2>
                <p className="ap-nota">
                  Atendimento remoto com pacientes via videoconferência ao vivo ou questionário clínico digital.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`btn ${modoEntrevista === 'video' ? 'btn-cheio' : 'btn-contorno'} btn-sm`}
                  onClick={() => setModoEntrevista('video')}
                >
                  📹 Tele-Triagem por Vídeo
                </button>
                <button
                  type="button"
                  className={`btn ${modoEntrevista === 'digital' ? 'btn-cheio' : 'btn-contorno'} btn-sm`}
                  onClick={() => setModoEntrevista('digital')}
                >
                  💬 Questionário Clínico / IA
                </button>
                <button
                  type="button"
                  className={`btn ${modoEntrevista === 'fila' ? 'btn-cheio' : 'btn-contorno'} btn-sm`}
                  onClick={() => {
                    atualizarPreTriagens()
                    setModoEntrevista('fila')
                  }}
                >
                  👥 Pacientes para Tele-Atendimento ({preTriagens.length})
                </button>
              </div>
            </div>

            {/* Sub-aba 1: Vídeo */}
            {modoEntrevista === 'video' && (
              <div className="prof-tele-box" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ fontSize: '1.15rem', color: '#1e293b', margin: 0 }}>
                      Iniciar Consulta por Vídeo Imediata
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
                      Abra uma sala de tele-entrevista criptografada em alta definição. O paciente se conecta direto pelo celular ou navegador sem instalar nada.
                    </p>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Identificador / Nome da Sala:</span>
                      <input
                        type="text"
                        value={idSalaManual}
                        onChange={(e) => {
                          const val = e.target.value
                          const extraido = extrairCodigoSala(val)
                          setIdSalaManual(extraido || val)
                        }}
                        placeholder="Ex: Tele-Gestor-1 ou heitorfernandez01@gmail.com"
                        style={{
                          padding: '10px 14px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          fontFamily: 'inherit',
                          fontSize: '0.9rem',
                        }}
                      />
                      <small style={{ color: '#64748b', fontSize: '0.78rem' }}>
                        💡 Digite o e-mail do paciente ou o código da sala. Se colar um link, o código será extraído automaticamente.
                      </small>
                    </label>

                    {preTriagens.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                          Conectar direto com paciente que aguarda:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {preTriagens.slice(0, 4).map((pt) => {
                            const identificador = (pt as any).pacienteNome || (pt as any).pacienteId || pt.id
                            return (
                              <button
                                key={pt.id}
                                type="button"
                                className="btn btn-contorno btn-sm"
                                style={{ fontSize: '0.78rem', padding: '4px 10px', background: '#f8fafc' }}
                                onClick={() => {
                                  setIdSalaManual(identificador)
                                  setChamadaAtiva({
                                    idSala: identificador,
                                    nomePaciente: (pt as any).pacienteNome || pt.queixa.slice(0, 20) || 'Paciente',
                                  })
                                }}
                              >
                                📞 {(pt as any).pacienteNome || pt.queixa.slice(0, 18)}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn btn-cheio"
                      style={{ background: '#059669', borderColor: '#059669', padding: '12px 20px', fontSize: '0.95rem' }}
                      onClick={() => {
                        const extraido = extrairCodigoSala(idSalaManual) || idSalaManual.trim() || 'Tele-Gestor'
                        setChamadaAtiva({
                          idSala: extraido,
                          nomePaciente: 'Paciente Remoto',
                        })
                      }}
                    >
                      📹 Abrir Sala de Tele-Entrevista Agora
                    </button>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b' }}>
                      🔗 Link de Acesso do Paciente
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                      Envie este link para o paciente por WhatsApp ou e-mail. Ao abrir, ele entrará <strong>diretamente nesta mesma sala</strong>:
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="text"
                        readOnly
                        value={linkPaciente}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: '#fff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          color: '#475569',
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-contorno btn-sm"
                        onClick={copiarLink}
                      >
                        {copiado ? '✓ Copiado!' : '📋 Copiar'}
                      </button>
                    </div>

                    <div style={{ marginTop: '8px', padding: '10px 12px', background: '#eff6ff', borderRadius: '6px', fontSize: '0.8rem', color: '#1e40af' }}>
                      💡 <strong>Como funciona a conexão:</strong> O paciente e o gestor precisam ter o mesmo código de sala. Você pode enviar o link acima ao paciente OU digitar o e-mail/código dele no campo da esquerda e clicar em Abrir Sala.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-aba 2: Questionário / Assistente Digital */}
            {modoEntrevista === 'digital' && (
              <div className="entrevista-incorporada" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
                <div style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: '#1e293b' }}>
                    Questionário Clínico de Pré-Triagem Online
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Preencha ou simule a entrevista interativa de triagem para registrar sintomas, dor e queixas do paciente.
                  </p>
                </div>
                <Entrevista embutido aoConcluir={() => {
                  atualizarPreTriagens()
                  alert('Pré-triagem concluída e registrada com sucesso!')
                  setModoEntrevista('fila')
                }} />
              </div>
            )}

            {/* Sub-aba 3: Fila de Tele-Atendimento */}
            {modoEntrevista === 'fila' && (
              <div>
                {preTriagens.length === 0 ? (
                  <div className="prof-vazio" style={{ padding: '32px', textAlign: 'center', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '1rem', color: '#64748b', margin: '0 0 6px' }}>Nenhum paciente aguardando tele-atendimento no momento.</p>
                    <small style={{ color: '#94a3b8' }}>Assim que um paciente responder à pré-triagem online ou solicitar atendimento remoto, ele aparecerá aqui com um botão de chamada de vídeo direta.</small>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {preTriagens.map((pt) => (
                      <div
                        key={pt.id}
                        style={{
                          background: '#fff',
                          border: pt.alerta ? '2px solid #ef4444' : '1px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className={`badge ${pt.urgencia === 'Alto' || pt.alerta ? 'badge-alerta' : 'badge-sucesso'}`}>
                            {pt.urgencia ? `Urgência ${pt.urgencia}` : (pt.alerta ? '⚠️ Alerta' : '✓ Estável')}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {new Date(pt.criadaEm).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div>
                          <h4 style={{ margin: '0 0 4px', fontSize: '0.98rem', color: '#1e293b' }}>
                            {pt.queixa || 'Sintomas não detalhados'}
                          </h4>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                            {pt.idade && `Idade: ${pt.idade} anos • `}{pt.peso && `Peso: ${pt.peso}`}
                          </p>
                        </div>

                        {pt.redFlags && (
                          <div style={{ padding: '6px 10px', borderRadius: '6px', background: pt.alerta ? '#fef2f2' : '#f0fdf4', fontSize: '0.8rem', color: pt.alerta ? '#dc2626' : '#15803d' }}>
                            {pt.alerta ? `🚩 ${pt.redFlags}` : `✓ ${pt.redFlags}`}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <button
                            type="button"
                            className="btn btn-cheio btn-sm"
                            style={{ flex: 1, background: '#2563eb', borderColor: '#2563eb' }}
                            onClick={() =>
                              setChamadaAtiva({
                                idSala: (pt as any).pacienteNome || (pt as any).pacienteId || pt.id,
                                nomePaciente: (pt as any).pacienteNome || pt.queixa.slice(0, 20) || 'Paciente',
                              })
                            }
                          >
                            📹 Iniciar Vídeo
                          </button>
                          <button
                            type="button"
                            className="btn btn-contorno btn-sm"
                            onClick={() => {
                              setPreTriagemSelecionada(pt)
                              setAbaAtiva('preTriagens')
                            }}
                          >
                            Ver Dados
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Modal de Chamada de Vídeo para o Profissional */}
        {chamadaAtiva && (
          <div className="video-modal-overlay">
            <div className="video-modal-conteudo">
              <SalaVideoTriagem
                idSala={chamadaAtiva.idSala}
                nomeUsuario={sessao.usuario.nome}
                papel="profissional"
                aoEncerrar={() => setChamadaAtiva(null)}
              />
            </div>
          </div>
        )}

        {/* 3. MAPA DE LEITOS EXPANDIDO */}
        {abaAtiva === 'leitos' && modulos.includes('leitos') && (
          <div className="prof-painel-aba">
            <MapaLeitos leitos={dados.leitos} />
          </div>
        )}

        {/* 4. INDICADORES EXPANDIDOS */}
        {abaAtiva === 'indicadores' && modulos.includes('indicadores') && (
          <div className="prof-painel-aba">
            <Indicadores fila={dados.fila} leitos={dados.leitos} />
          </div>
        )}
      </main>
    </div>
  )
}
