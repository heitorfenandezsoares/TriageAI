import { useEffect, useRef, useState, type FormEvent } from 'react'
import CabecalhoPublico from '../componentes/CabecalhoPublico'
import SalaVideoTriagem from '../componentes/SalaVideoTriagem'
import { useAuth } from '../auth/AuthContext'
import { idPaciente, salvarPreTriagem } from '../dados/paciente'
import {
  PERGUNTAS_PADRAO,
  gerarPerguntaRisco,
  gerarOrientacaoConforto,
  determinarUrgenciaERedFlags,
  gerarTabelaMarkdown,
  type Resposta,
} from '../dados/entrevista'
import { useIdioma } from '../i18n/idioma'

export interface EntrevistaProps {
  embutido?: boolean
  aoConcluir?: () => void
}

interface Mensagem {
  id: string
  autor: 'bot' | 'paciente'
  texto?: string
  alerta?: boolean
  tabela?: {
    idade: string
    peso: string
    sintomas: string
    redFlags: string
    urgencia: 'Baixo' | 'Médio' | 'Alto'
    tabelaMarkdown: string
  }
}

type EtapaConversa = 'idade' | 'peso' | 'sintomas' | 'risco' | 'concluido'

export default function Entrevista({ embutido = false, aoConcluir }: EntrevistaProps = {}) {
  const { t } = useIdioma()
  const { sessao } = useAuth()
  const e = t.entrevista

  const [modalidade, setModalidade] = useState<'chat' | 'video'>('chat')
  const [etapa, setEtapa] = useState<EtapaConversa>('idade')
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: 'msg-0',
      autor: 'bot',
      texto: PERGUNTAS_PADRAO.idade,
    },
  ])
  const [esperando, setEsperando] = useState(false)
  const [entrada, setEntrada] = useState('')
  const [copiado, setCopiado] = useState(false)

  // Dados coletados
  const [idade, setIdade] = useState('')
  const [peso, setPeso] = useState('')
  const [sintomas, setSintomas] = useState('')

  const fimRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [mensagens.length, esperando])

  useEffect(() => {
    if (!esperando && etapa !== 'concluido' && etapa !== 'risco') {
      inputRef.current?.focus()
    }
  }, [etapa, esperando])

  const adicionarRespostaPaciente = (textoValor: string) => {
    setMensagens((prev) => [
      ...prev,
      { id: `paciente-${Date.now()}`, autor: 'paciente', texto: textoValor },
    ])
  }

  const enviarEntradaTexto = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const valor = entrada.trim()
    if (!valor || esperando) return

    setEntrada('')

    if (etapa === 'idade') {
      setIdade(valor)
      adicionarRespostaPaciente(valor)
      setEsperando(true)

      setTimeout(() => {
        setMensagens((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, autor: 'bot', texto: PERGUNTAS_PADRAO.peso },
        ])
        setEtapa('peso')
        setEsperando(false)
      }, 500)
    } else if (etapa === 'peso') {
      setPeso(valor)
      adicionarRespostaPaciente(valor)
      setEsperando(true)

      setTimeout(() => {
        setMensagens((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, autor: 'bot', texto: PERGUNTAS_PADRAO.sintomas },
        ])
        setEtapa('sintomas')
        setEsperando(false)
      }, 500)
    } else if (etapa === 'sintomas') {
      setSintomas(valor)
      adicionarRespostaPaciente(valor)
      setEsperando(true)

      const perguntaRisco = gerarPerguntaRisco(valor)

      setTimeout(() => {
        setMensagens((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, autor: 'bot', texto: perguntaRisco },
        ])
        setEtapa('risco')
        setEsperando(false)
      }, 600)
    }
  }

  const responderRisco = (opcao: 'sim' | 'nao') => {
    if (esperando || etapa !== 'risco') return

    const respostaTexto = opcao === 'sim' ? 'Sim' : 'Não'
    adicionarRespostaPaciente(respostaTexto)
    setEsperando(true)

    const temEmergencia = opcao === 'sim'
    const { urgencia, redFlags } = determinarUrgenciaERedFlags(sintomas, temEmergencia)
    const orientacao = temEmergencia
      ? '⚠️ Atenção: Seus sintomas podem indicar uma situação de emergência que requer avaliação imediata. Por favor, comunique a equipe de enfermagem agora mesmo ou ligue 192 (SAMU).'
      : gerarOrientacaoConforto(sintomas)

    const encerramento =
      'Muito obrigado pelas informações. Seus dados foram registrados com sucesso no seu prontuário e o especialista da equipe de saúde assumirá o seu atendimento em breve.'

    const tabelaMd = gerarTabelaMarkdown(idade, peso, sintomas, redFlags, urgencia)

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        { id: `bot-orientacao-${Date.now()}`, autor: 'bot', texto: orientacao, alerta: temEmergencia },
        { id: `bot-encerramento-${Date.now()}`, autor: 'bot', texto: encerramento },
        {
          id: `bot-tabela-${Date.now()}`,
          autor: 'bot',
          tabela: {
            idade,
            peso,
            sintomas,
            redFlags,
            urgencia,
            tabelaMarkdown: tabelaMd,
          },
        },
      ])

      // Intercepta e salva de forma persistente no prontuário do paciente e no banco de dados
      const idParaSalvar = sessao ? idPaciente(sessao.usuario) : 'anonimo'
      const respostasRegistro: Resposta[] = [
        { passo: 'idade', valor: idade },
        { passo: 'peso', valor: peso },
        { passo: 'sintomas', valor: sintomas },
        { passo: 'risco', valor: opcao },
      ]

      salvarPreTriagem(idParaSalvar, respostasRegistro, {
        idade,
        peso,
        queixa: sintomas,
        alerta: temEmergencia,
        urgencia,
        redFlags,
        tabelaMarkdown: tabelaMd,
        pacienteNome: sessao?.usuario.nome || 'Paciente',
      })

      setEtapa('concluido')
      setEsperando(false)
    }, 700)
  }

  const reiniciar = () => {
    setEtapa('idade')
    setIdade('')
    setPeso('')
    setSintomas('')
    setEntrada('')
    setMensagens([
      {
        id: `msg-${Date.now()}`,
        autor: 'bot',
        texto: PERGUNTAS_PADRAO.idade,
      },
    ])
    setEsperando(false)
  }

  const copiarMarkdown = (md: string) => {
    navigator.clipboard.writeText(md)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const conteudoChat = (
    <div className="ent-chat-wrapper">
      <div className="ent-chat" role="log" aria-live="polite" aria-label="Pré-triagem virtual">
        {mensagens.map((m) => (
          <div key={m.id} className={`ent-linha ${m.autor}`}>
            {m.texto && (
              <p className={`bolha ${m.autor === 'bot' ? 'bot' : 'eu'} ${m.alerta ? 'alerta' : ''}`}>
                {m.texto}
              </p>
            )}

            {m.tabela && (
              <div className="tabela-triagem-container" role="region" aria-label="Tabela de Triagem">
                <div className="tabela-triagem-header">
                  <strong>📋 Resumo Clínico de Triagem</strong>
                  <button
                    type="button"
                    className="btn btn-contorno btn-sm"
                    onClick={() => copiarMarkdown(m.tabela!.tabelaMarkdown)}
                  >
                    {copiado ? '✓ Copiado' : 'Copiar Tabela (Markdown)'}
                  </button>
                </div>
                <table className="tabela-triagem">
                  <thead>
                    <tr>
                      <th>Métrica / Dado</th>
                      <th>Informação Coletada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Idade</strong></td>
                      <td>{m.tabela.idade.toLowerCase().includes('ano') ? m.tabela.idade : `${m.tabela.idade} anos`}</td>
                    </tr>
                    <tr>
                      <td><strong>Peso</strong></td>
                      <td>{m.tabela.peso.toLowerCase().includes('kg') ? m.tabela.peso : `${m.tabela.peso} kg`}</td>
                    </tr>
                    <tr>
                      <td><strong>Queixa Principal</strong></td>
                      <td>{m.tabela.sintomas}</td>
                    </tr>
                    <tr>
                      <td><strong>Sinais de Alerta (Red Flags)</strong></td>
                      <td className={m.tabela.redFlags.includes('Sim') ? 'texto-alerta' : ''}>
                        {m.tabela.redFlags}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Nível de Urgência</strong></td>
                      <td>
                        <span
                          className={`badge ${
                            m.tabela.urgencia === 'Alto'
                              ? 'badge-alerta'
                              : m.tabela.urgencia === 'Médio'
                              ? 'badge-info'
                              : 'badge-sucesso'
                          }`}
                        >
                          {m.tabela.urgencia}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}

        {esperando && (
          <p className="bolha bot digitando" aria-label="Digitando...">
            <span />
            <span />
            <span />
          </p>
        )}

        <div ref={fimRef} />
      </div>

      {/* Controles de Entrada */}
      <div className="ent-controles">
        {!esperando && (etapa === 'idade' || etapa === 'peso' || etapa === 'sintomas') && (
          <form className="ent-form" onSubmit={enviarEntradaTexto}>
            <input
              ref={inputRef}
              type={etapa === 'idade' || etapa === 'peso' ? 'text' : 'text'}
              value={entrada}
              placeholder={
                etapa === 'idade'
                  ? 'Ex: 32 anos'
                  : etapa === 'peso'
                  ? 'Ex: 70 kg'
                  : 'Descreva detalhadamente o que está sentindo...'
              }
              maxLength={250}
              required
              onChange={(ev) => setEntrada(ev.target.value)}
            />
            <button type="submit" className="btn btn-cheio">
              Enviar
            </button>
          </form>
        )}

        {!esperando && etapa === 'risco' && (
          <div className="ent-opcoes-risco">
            <button
              type="button"
              className="btn btn-cheio btn-perigo"
              onClick={() => responderRisco('sim')}
            >
              Sim, sinto estes sintomas graves
            </button>
            <button
              type="button"
              className="btn btn-contorno"
              onClick={() => responderRisco('nao')}
            >
              Não, não sinto nenhum destes sintomas
            </button>
          </div>
        )}

        {etapa === 'concluido' && (
          <div className="ent-acoes-finais">
            {embutido && aoConcluir ? (
              <button type="button" className="btn btn-cheio" onClick={aoConcluir}>
                {e.irArea}
              </button>
            ) : (
              <a className="btn btn-cheio" href="#/paciente">
                {e.irArea}
              </a>
            )}
            <button type="button" className="btn btn-contorno" onClick={reiniciar}>
              Refazer Pré-Triagem
            </button>
          </div>
        )}
      </div>
    </div>
  )

  const idSala = sessao ? idPaciente(sessao.usuario) : 'Atendimento'

  const seletorModalidade = (
    <div className="ent-seletor-modalidade">
      <button
        type="button"
        className={`btn-modalidade ${modalidade === 'chat' ? 'ativo' : ''}`}
        onClick={() => setModalidade('chat')}
      >
        💬 Assistente Virtual (Chat Guiado)
      </button>
      <button
        type="button"
        className={`btn-modalidade ${modalidade === 'video' ? 'ativo' : ''}`}
        onClick={() => setModalidade('video')}
      >
        📹 Entrevista por Vídeo ao Vivo
      </button>
    </div>
  )

  const conteudoPrincipal = modalidade === 'video' ? (
    <SalaVideoTriagem
      idSala={idSala}
      nomeUsuario={sessao?.usuario.nome ?? 'Paciente'}
      papel="paciente"
      aoEncerrar={() => setModalidade('chat')}
    />
  ) : (
    conteudoChat
  )

  if (embutido) {
    return (
      <div className="ent-container-embutido">
        {seletorModalidade}
        {conteudoPrincipal}
      </div>
    )
  }

  return (
    <>
      <CabecalhoPublico />
      <main className="pub-conteudo ent">
        <a className="ent-voltar" href="#/paciente">
          ← Voltar para a área do paciente
        </a>
        <h1>Assistente de Pré-Triagem</h1>
        <p className="pub-lead">
          Coleta rápida de dados complementares e orientações iniciais para a equipe de saúde.
        </p>
        <p className="ent-aviso">
          {e.aviso}
        </p>

        {seletorModalidade}
        {conteudoPrincipal}
      </main>
    </>
  )
}
