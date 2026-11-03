import { useEffect, useRef, useState, type FormEvent } from 'react'
import CabecalhoPublico from '../componentes/CabecalhoPublico'
import SalaVideoTriagem from '../componentes/SalaVideoTriagem'
import { useAuth } from '../auth/AuthContext'
import { idPaciente, salvarPreTriagem } from '../dados/paciente'
import {
  PERGUNTAS_PADRAO,
  CATALOGO_SINTOMAS,
  REGIOES_CORPO,
  OPCOES_PESO_RAPIDO,
  OPCOES_TEMPO_INICIO,
  OPCOES_COMORBIDADES,
  analisarTextoLivre,
  gerarPerguntaRisco,
  gerarOrientacaoConforto,
  avaliarCasoClinicoCompleto,
  gerarTabelaMarkdown,
  type RegiaoCorpoId,
  type Resposta,
} from '../dados/entrevista'
import { useIdioma } from '../i18n/idioma'

export interface EntrevistaProps {
  embutido?: boolean
  aoConcluir?: () => void
}

interface DadosTabelaResumo {
  idade: string
  peso: string
  sintomas: string
  dor: number
  tempoInicio: string
  comorbidades: string[]
  corManchester: string
  especialidade: string
  redFlags: string
  urgencia: 'Baixo' | 'Médio' | 'Alto'
  tabelaMarkdown: string
}

interface Mensagem {
  id: string
  autor: 'bot' | 'paciente'
  texto?: string
  alerta?: boolean
  destaqueIA?: boolean
  tabela?: DadosTabelaResumo
}

type EtapaConversa = 'idade' | 'peso' | 'sintomas' | 'detalhes' | 'risco' | 'concluido'

const ORDEM_ETAPAS: { id: EtapaConversa; rotulo: string }[] = [
  { id: 'idade', rotulo: '1. Idade' },
  { id: 'peso', rotulo: '2. Peso' },
  { id: 'sintomas', rotulo: '3. Sintomas' },
  { id: 'detalhes', rotulo: '4. Intensidade' },
  { id: 'risco', rotulo: '5. Alerta' },
]

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
  const [ouvindoVoz, setOuvindoVoz] = useState(false)

  // Dados clínicos coletados
  const [idade, setIdade] = useState('')
  const [idadeSlider, setIdadeSlider] = useState(30)
  const [peso, setPeso] = useState('')
  const [sintomas, setSintomas] = useState('')
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([])
  const [modoCapturaSintoma, setModoCapturaSintoma] = useState<'rapido' | 'corpo'>('rapido')
  const [regiaoAtiva, setRegiaoAtiva] = useState<RegiaoCorpoId>('cabeca')

  // Dados complementares da etapa 'detalhes'
  const [dor, setDor] = useState<number>(3)
  const [tempoInicio, setTempoInicio] = useState<string>('Hoje (algumas horas)')
  const [comorbidades, setComorbidades] = useState<string[]>(['Nenhuma'])

  const fimRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [mensagens.length, esperando, etapa])

  useEffect(() => {
    if (!esperando && (etapa === 'idade' || etapa === 'peso' || etapa === 'sintomas')) {
      inputRef.current?.focus()
    }
  }, [etapa, esperando])

  const adicionarRespostaPaciente = (textoValor: string) => {
    setMensagens((prev) => [
      ...prev,
      { id: `paciente-${Date.now()}-${Math.random()}`, autor: 'paciente', texto: textoValor },
    ])
  }

  // Reconhecimento de Voz via Web Speech API (pt-BR)
  const alternarReconhecimentoVoz = () => {
    const win = window as unknown as {
      SpeechRecognition?: new () => {
        lang: string
        continuous: boolean
        interimResults: boolean
        onstart: () => void
        onend: () => void
        onerror: () => void
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void
        start: () => void
      }
      webkitSpeechRecognition?: new () => {
        lang: string
        continuous: boolean
        interimResults: boolean
        onstart: () => void
        onend: () => void
        onerror: () => void
        onresult: (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void
        start: () => void
      }
    }

    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition
    if (!SpeechRec) {
      alert('Seu navegador não suporta ditado por voz nativo. Use os botões rápidos ou digite no campo abaixo.')
      return
    }

    if (ouvindoVoz) return

    try {
      const rec = new SpeechRec()
      rec.lang = 'pt-BR'
      rec.continuous = false
      rec.interimResults = false

      rec.onstart = () => setOuvindoVoz(true)
      rec.onend = () => setOuvindoVoz(false)
      rec.onerror = () => setOuvindoVoz(false)

      rec.onresult = (ev) => {
        const transcricao = ev.results?.[0]?.[0]?.transcript
        if (transcricao) {
          setEntrada((prev) => (prev ? `${prev} ${transcricao}` : transcricao))
        }
      }

      rec.start()
    } catch {
      setOuvindoVoz(false)
    }
  }

  // Processa a entrada (texto livre, voz ou clique rápido) com inteligência NLU
  const processarEntradaUsuario = (valorBruto: string) => {
    const valor = valorBruto.trim()
    if (!valor || esperando) return

    setEntrada('')
    adicionarRespostaPaciente(valor)
    setEsperando(true)

    // Analisa se o usuário digitou múltiplos dados de uma vez (ex: "Tenho 32 anos, 70kg e dor no peito")
    const nlu = analisarTextoLivre(valor)

    setTimeout(() => {
      if (etapa === 'idade') {
        const idadeFinal = nlu.idadeExtraida || (/\d+/.test(valor) ? `${valor.replace(/\D/g, '')} anos` : valor)
        setIdade(idadeFinal)

        // Se o paciente já informou peso E sintomas na mesma frase!
        if (nlu.pesoExtraido && nlu.sintomasExtraidos) {
          setPeso(nlu.pesoExtraido)
          setSintomas(nlu.sintomasExtraidos)
          if (nlu.dorExtraida !== undefined) setDor(nlu.dorExtraida)
          if (nlu.tempoExtraido) setTempoInicio(nlu.tempoExtraido)

          setMensagens((prev) => [
            ...prev,
            {
              id: `bot-nlu-${Date.now()}`,
              autor: 'bot',
              destaqueIA: true,
              texto: `🧠 Compreensão Inteligente: Identifiquei automaticamente sua idade (${idadeFinal}), peso (${nlu.pesoExtraido}) e queixa principal ("${nlu.sintomasExtraidos}").`,
            },
            {
              id: `bot-det-${Date.now() + 1}`,
              autor: 'bot',
              texto: PERGUNTAS_PADRAO.detalhes,
            },
          ])
          setEtapa('detalhes')
          setEsperando(false)
          return
        }

        // Se informou idade e sintomas (sem peso)
        if (nlu.sintomasExtraidos && !nlu.pesoExtraido) {
          setSintomas(nlu.sintomasExtraidos)
          setMensagens((prev) => [
            ...prev,
            {
              id: `bot-nlu-${Date.now()}`,
              autor: 'bot',
              destaqueIA: true,
              texto: `🧠 Anotei sua idade (${idadeFinal}) e seus sintomas ("${nlu.sintomasExtraidos}"). Qual é o seu peso aproximado (em kg)?`,
            },
          ])
          setEtapa('peso')
          setEsperando(false)
          return
        }

        // Fluxo normal: vai para peso
        setMensagens((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, autor: 'bot', texto: PERGUNTAS_PADRAO.peso },
        ])
        setEtapa('peso')
        setEsperando(false)
      } else if (etapa === 'peso') {
        const pesoFinal = nlu.pesoExtraido || (/\d+/.test(valor) && !valor.toLowerCase().includes('kg') ? `${valor} kg` : valor)
        setPeso(pesoFinal)

        // Se já tínhamos sintomas capturados antes via NLU, pula direto para detalhes!
        if (sintomas) {
          setMensagens((prev) => [
            ...prev,
            { id: `bot-${Date.now()}`, autor: 'bot', texto: PERGUNTAS_PADRAO.detalhes },
          ])
          setEtapa('detalhes')
          setEsperando(false)
          return
        }

        // Se informou peso + sintomas juntos agora
        if (nlu.sintomasExtraidos) {
          setSintomas(nlu.sintomasExtraidos)
          setMensagens((prev) => [
            ...prev,
            {
              id: `bot-nlu-${Date.now()}`,
              autor: 'bot',
              destaqueIA: true,
              texto: `🧠 Peso registrado (${pesoFinal}) e queixa identificada ("${nlu.sintomasExtraidos}").`,
            },
            { id: `bot-det-${Date.now() + 1}`, autor: 'bot', texto: PERGUNTAS_PADRAO.detalhes },
          ])
          setEtapa('detalhes')
          setEsperando(false)
          return
        }

        setMensagens((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, autor: 'bot', texto: PERGUNTAS_PADRAO.sintomas },
        ])
        setEtapa('sintomas')
        setEsperando(false)
      } else if (etapa === 'sintomas') {
        // Combina sintomas selecionados nos chips (se houver) com o texto digitado
        const combinados = sintomasSelecionados.length > 0
          ? `${sintomasSelecionados.join(', ')}. ${valor}`
          : valor
        setSintomas(combinados)
        if (nlu.dorExtraida !== undefined) setDor(nlu.dorExtraida)
        if (nlu.tempoExtraido) setTempoInicio(nlu.tempoExtraido)

        setMensagens((prev) => [
          ...prev,
          { id: `bot-${Date.now()}`, autor: 'bot', texto: PERGUNTAS_PADRAO.detalhes },
        ])
        setEtapa('detalhes')
        setEsperando(false)
      }
    }, 450)
  }

  const enviarEntradaTexto = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    processarEntradaUsuario(entrada)
  }

  const alternarSintomaChip = (textoClinico: string) => {
    setSintomasSelecionados((prev) =>
      prev.includes(textoClinico) ? prev.filter((item) => item !== textoClinico) : [...prev, textoClinico]
    )
  }

  const confirmarSintomasSelecionados = () => {
    if (sintomasSelecionados.length === 0 && !entrada.trim()) return
    const textoFinal = [
      ...sintomasSelecionados,
      ...(entrada.trim() ? [entrada.trim()] : []),
    ].join(', ')
    setSintomasSelecionados([])
    setEntrada('')
    adicionarRespostaPaciente(textoFinal)
    setSintomas(textoFinal)
    setEsperando(true)

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, autor: 'bot', texto: PERGUNTAS_PADRAO.detalhes },
      ])
      setEtapa('detalhes')
      setEsperando(false)
    }, 450)
  }

  const alternarComorbidade = (opcao: string) => {
    if (opcao === 'Nenhuma') {
      setComorbidades(['Nenhuma'])
      return
    }
    setComorbidades((prev) => {
      const semNenhuma = prev.filter((c) => c !== 'Nenhuma')
      const atualizado = semNenhuma.includes(opcao)
        ? semNenhuma.filter((c) => c !== opcao)
        : [...semNenhuma, opcao]
      return atualizado.length === 0 ? ['Nenhuma'] : atualizado
    })
  }

  const confirmarDetalhesClinicos = () => {
    if (esperando || etapa !== 'detalhes') return
    const resumoDetalhes = `Dor nível ${dor}/10 • Início: ${tempoInicio} • Condições prévias: ${comorbidades.join(', ')}`
    adicionarRespostaPaciente(resumoDetalhes)
    setEsperando(true)

    const perguntaRisco = gerarPerguntaRisco(sintomas)

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, autor: 'bot', texto: perguntaRisco },
      ])
      setEtapa('risco')
      setEsperando(false)
    }, 500)
  }

  const responderRisco = (opcao: 'sim' | 'moderado' | 'nao') => {
    if (esperando || etapa !== 'risco') return

    const rotuloResposta =
      opcao === 'sim'
        ? '🚨 Sim, sinto esses sintomas de forma intensa agora'
        : opcao === 'moderado'
        ? '⚠️ Sinto de forma leve ou intermitente'
        : '✅ Não, não sinto nenhum desses sinais de alerta'

    adicionarRespostaPaciente(rotuloResposta)
    setEsperando(true)

    const avaliacao = avaliarCasoClinicoCompleto({
      idade,
      peso,
      sintomas,
      nivelRisco: opcao,
      dor,
      tempoInicio,
      comorbidades,
    })

    const orientacao = avaliacao.alertaCritico
      ? '⚠️ ALERTA DE EMERGÊNCIA: Seus sintomas e sinais de risco indicam necessidade de atendimento médico imediato. Dirija-se imediatamente à sala de emergência ou acione a equipe de enfermagem local (ou SAMU 192).'
      : gerarOrientacaoConforto(sintomas)

    const encerramento = `✅ Pré-triagem concluída! Classificação preliminar sugerida: ${avaliacao.corManchester} (${avaliacao.especialidadeSugerida}). Seu prontuário já foi salvo e enviado para a fila da equipe médica.`

    const queixaEnriquecida = `${sintomas} (Dor: ${dor}/10 | Início: ${tempoInicio})`
    const tabelaMd = gerarTabelaMarkdown(idade, peso, sintomas, avaliacao.redFlags, avaliacao.urgencia, {
      dor,
      tempoInicio,
      comorbidades,
      corManchester: avaliacao.corManchester,
      especialidade: avaliacao.especialidadeSugerida,
    })

    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        {
          id: `bot-orientacao-${Date.now()}`,
          autor: 'bot',
          texto: orientacao,
          alerta: avaliacao.alertaCritico,
        },
        {
          id: `bot-encerramento-${Date.now() + 1}`,
          autor: 'bot',
          texto: encerramento,
        },
        {
          id: `bot-tabela-${Date.now() + 2}`,
          autor: 'bot',
          tabela: {
            idade,
            peso,
            sintomas,
            dor,
            tempoInicio,
            comorbidades,
            corManchester: avaliacao.corManchester,
            especialidade: avaliacao.especialidadeSugerida,
            redFlags: avaliacao.redFlags,
            urgencia: avaliacao.urgencia,
            tabelaMarkdown: tabelaMd,
          },
        },
      ])

      const idParaSalvar = sessao ? idPaciente(sessao.usuario) : 'anonimo'
      const respostasRegistro: Resposta[] = [
        { passo: 'idade', valor: idade },
        { passo: 'peso', valor: peso },
        { passo: 'sintomas', valor: queixaEnriquecida },
        { passo: 'detalhes', valor: `Dor ${dor}/10, ${tempoInicio}, Comorbidades: ${comorbidades.join(', ')}` },
        { passo: 'risco', valor: opcao === 'sim' ? 'sim' : 'nao' },
      ]

      salvarPreTriagem(idParaSalvar, respostasRegistro, {
        idade,
        peso,
        queixa: queixaEnriquecida,
        alerta: avaliacao.alertaCritico,
        urgencia: avaliacao.urgencia,
        redFlags: avaliacao.redFlags,
        tabelaMarkdown: tabelaMd,
        pacienteNome: sessao?.usuario.nome || 'Paciente',
      })

      setEtapa('concluido')
      setEsperando(false)
    }, 600)
  }

  const reiniciar = () => {
    setEtapa('idade')
    setIdade('')
    setPeso('')
    setSintomas('')
    setSintomasSelecionados([])
    setDor(3)
    setTempoInicio('Hoje (algumas horas)')
    setComorbidades(['Nenhuma'])
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

  const indiceEtapaAtual = etapa === 'concluido' ? 5 : ORDEM_ETAPAS.findIndex((x) => x.id === etapa)

  const regiaoDetalhe = REGIOES_CORPO.find((r) => r.id === regiaoAtiva) ?? REGIOES_CORPO[0]

  const conteudoChat = (
    <div className="ent-chat-wrapper">
      {/* Barra de Progresso Inteligente e Resumo em Tempo Real */}
      <div
        style={{
          padding: '10px 14px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {ORDEM_ETAPAS.map((item, idx) => {
              const concluida = idx < indiceEtapaAtual
              const ativa = item.id === etapa
              return (
                <span
                  key={item.id}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: ativa ? 700 : 500,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    background: concluida ? '#dcfce7' : ativa ? '#dbeafe' : '#f1f5f9',
                    color: concluida ? '#166534' : ativa ? '#1e40af' : '#64748b',
                    border: ativa ? '1px solid #93c5fd' : '1px solid transparent',
                  }}
                >
                  {concluida ? '✓ ' : ''}{item.rotulo}
                </span>
              )
            })}
          </div>
          {(idade || peso || sintomas) && (
            <button
              type="button"
              className="btn btn-contorno btn-sm"
              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
              onClick={reiniciar}
            >
              🔄 Reiniciar
            </button>
          )}
        </div>

        {/* Chips dos dados já capturados pela IA */}
        {(idade || peso || sintomas) && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '0.76rem' }}>
            {idade && (
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px' }}>
                👤 Idade: <strong>{idade}</strong>
              </span>
            )}
            {peso && (
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px' }}>
                ⚖️ Peso: <strong>{peso}</strong>
              </span>
            )}
            {sintomas && (
              <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px' }}>
                🩺 Queixa: <strong>{sintomas.length > 45 ? `${sintomas.slice(0, 45)}...` : sintomas}</strong>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Histórico de Mensagens do Chat */}
      <div className="ent-chat" role="log" aria-live="polite" aria-label="Pré-triagem virtual">
        {mensagens.map((m) => (
          <div key={m.id} className={`ent-linha ${m.autor}`}>
            {m.texto && (
              <p
                className={`bolha ${m.autor === 'bot' ? 'bot' : 'eu'} ${m.alerta ? 'alerta' : ''}`}
                style={
                  m.destaqueIA
                    ? { background: '#eff6ff', borderLeft: '4px solid #2563eb', color: '#1e3a8a', fontWeight: 500 }
                    : undefined
                }
              >
                {m.texto}
              </p>
            )}

            {m.tabela && (
              <div className="tabela-triagem-container" role="region" aria-label="Tabela de Triagem">
                <div className="tabela-triagem-header">
                  <strong>📋 Prontuário Estruturado da Pré-Triagem</strong>
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
                      <th>Métrica Clínica</th>
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
                      <td>{m.tabela.peso}</td>
                    </tr>
                    <tr>
                      <td><strong>Queixa Principal</strong></td>
                      <td>{m.tabela.sintomas}</td>
                    </tr>
                    <tr>
                      <td><strong>Intensidade da Dor (EVA)</strong></td>
                      <td><strong>{m.tabela.dor}/10</strong> ({m.tabela.dor >= 8 ? 'Intensa' : m.tabela.dor >= 4 ? 'Moderada' : 'Leve'})</td>
                    </tr>
                    <tr>
                      <td><strong>Início dos Sintomas</strong></td>
                      <td>{m.tabela.tempoInicio}</td>
                    </tr>
                    <tr>
                      <td><strong>Condições Prévias</strong></td>
                      <td>{m.tabela.comorbidades.join(', ')}</td>
                    </tr>
                    <tr>
                      <td><strong>Protocolo Manchester Sugerido</strong></td>
                      <td><strong>{m.tabela.corManchester}</strong> · {m.tabela.especialidade}</td>
                    </tr>
                    <tr>
                      <td><strong>Sinais de Alerta (Red Flags)</strong></td>
                      <td className={m.tabela.redFlags.startsWith('Sim') ? 'texto-alerta' : ''}>
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

      {/* Painéis Interativos de Captura Multimodal */}
      <div className="ent-controles" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* 1. OPÇÕES RÁPIDAS DE IDADE */}
        {!esperando && etapa === 'idade' && (
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                ⚡ Seleção Rápida de Idade (ou deslize a barra):
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={idadeSlider}
                  onChange={(ev) => setIdadeSlider(Number(ev.target.value))}
                  style={{ width: '110px', cursor: 'pointer' }}
                />
                <button
                  type="button"
                  className="btn btn-cheio btn-sm"
                  style={{ padding: '3px 10px', fontSize: '0.78rem' }}
                  onClick={() => processarEntradaUsuario(`${idadeSlider} anos`)}
                >
                  Confirmar {idadeSlider} anos
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { rotulo: '👶 Criança (0–11)', valor: '8 anos' },
                { rotulo: '🧑 Jovem (12–17)', valor: '15 anos' },
                { rotulo: '🧑 18–29 anos', valor: '24 anos' },
                { rotulo: '👨 30–44 anos', valor: '36 anos' },
                { rotulo: '🧔 45–59 anos', valor: '52 anos' },
                { rotulo: '👵 60–74 anos', valor: '66 anos' },
                { rotulo: '👴 75+ anos', valor: '78 anos' },
              ].map((op) => (
                <button
                  key={op.rotulo}
                  type="button"
                  className="btn btn-contorno btn-sm"
                  style={{ fontSize: '0.78rem', padding: '4px 10px', background: '#fff' }}
                  onClick={() => processarEntradaUsuario(op.valor)}
                >
                  {op.rotulo}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. OPÇÕES RÁPIDAS DE PESO */}
        {!esperando && etapa === 'peso' && (
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
              ⚖️ Selecione sua faixa de peso com 1 clique:
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {OPCOES_PESO_RAPIDO.map((p) => (
                <button
                  key={p}
                  type="button"
                  className="btn btn-contorno btn-sm"
                  style={{ fontSize: '0.78rem', padding: '4px 10px', background: '#fff' }}
                  onClick={() => processarEntradaUsuario(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. PAINEL MULTIMODAL DE SINTOMAS (CHIPS + MAPA CORPORAL) */}
        {!esperando && etapa === 'sintomas' && (
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${modoCapturaSintoma === 'rapido' ? 'btn-cheio' : 'btn-contorno'}`}
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() => setModoCapturaSintoma('rapido')}
                >
                  🏷️ Sintomas Comuns
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${modoCapturaSintoma === 'corpo' ? 'btn-cheio' : 'btn-contorno'}`}
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  onClick={() => setModoCapturaSintoma('corpo')}
                >
                  🧍 Região do Corpo
                </button>
              </div>
              {sintomasSelecionados.length > 0 && (
                <button
                  type="button"
                  className="btn btn-cheio btn-sm"
                  style={{ background: '#059669', borderColor: '#059669', fontSize: '0.8rem' }}
                  onClick={confirmarSintomasSelecionados}
                >
                  ✓ Confirmar Selecionados ({sintomasSelecionados.length})
                </button>
              )}
            </div>

            {modoCapturaSintoma === 'rapido' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '6px' }}>
                {CATALOGO_SINTOMAS.map((item) => {
                  const ativo = sintomasSelecionados.includes(item.textoClinico)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => alternarSintomaChip(item.textoClinico)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        border: ativo ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: ativo ? '#dbeafe' : '#ffffff',
                        color: ativo ? '#1e3a8a' : '#1e293b',
                        fontWeight: ativo ? 600 : 400,
                      }}
                    >
                      <span>{item.icone}</span>
                      <span>{item.rotulo}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {REGIOES_CORPO.map((reg) => (
                    <button
                      key={reg.id}
                      type="button"
                      onClick={() => setRegiaoAtiva(reg.id)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        border: regiaoAtiva === reg.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: regiaoAtiva === reg.id ? '#eff6ff' : '#fff',
                        fontWeight: regiaoAtiva === reg.id ? 600 : 400,
                      }}
                    >
                      {reg.icone} {reg.nome}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '8px', background: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  {regiaoDetalhe.exemplos.map((ex) => {
                    const ativo = sintomasSelecionados.includes(ex)
                    return (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => alternarSintomaChip(ex)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          border: ativo ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          background: ativo ? '#dbeafe' : '#f8fafc',
                          color: ativo ? '#1e3a8a' : '#334155',
                          fontWeight: ativo ? 600 : 400,
                        }}
                      >
                        {ativo ? '✓ ' : '+ '}{ex}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. PAINEL INTERATIVO DE DETALHES CLÍNICOS (DOR EVA 0-10 + TEMPO + COMORBIDADES) */}
        {!esperando && etapa === 'detalhes' && (
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Escala Visual de Dor */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                📊 1. Intensidade da Dor ou Desconforto: <strong>{dor}/10</strong>{' '}
                {dor === 0 ? '😊 (Sem dor)' : dor <= 3 ? '🙂 (Leve)' : dor <= 6 ? '😐 (Moderada)' : dor <= 8 ? '😣 (Forte)' : '😭 (Insuportável)'}
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((nivel) => {
                  const selecionado = dor === nivel
                  const corFundo =
                    nivel <= 2 ? '#dcfce7' : nivel <= 5 ? '#fef9c3' : nivel <= 7 ? '#ffedd5' : '#fee2e2'
                  const corBorda =
                    nivel <= 2 ? '#22c55e' : nivel <= 5 ? '#eab308' : nivel <= 7 ? '#f97316' : '#ef4444'
                  return (
                    <button
                      key={nivel}
                      type="button"
                      onClick={() => setDor(nivel)}
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        background: selecionado ? corBorda : corFundo,
                        color: selecionado ? '#fff' : '#1e293b',
                        border: `2px solid ${corBorda}`,
                        transform: selecionado ? 'scale(1.08)' : 'none',
                      }}
                    >
                      {nivel}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tempo de Início */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                ⏱️ 2. Há quanto tempo os sintomas começaram?
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {OPCOES_TEMPO_INICIO.map((op) => {
                  const ativo = tempoInicio === op
                  return (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setTempoInicio(op)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        border: ativo ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: ativo ? '#dbeafe' : '#fff',
                        color: ativo ? '#1e3a8a' : '#334155',
                        fontWeight: ativo ? 600 : 400,
                      }}
                    >
                      {op}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Condições Prévias / Comorbidades */}
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
                🏥 3. Possui alguma condição de saúde prévia? (Pode marcar mais de uma)
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {OPCOES_COMORBIDADES.map((c) => {
                  const ativo = comorbidades.includes(c)
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => alternarComorbidade(c)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        border: ativo ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: ativo ? '#dbeafe' : '#fff',
                        color: ativo ? '#1e3a8a' : '#334155',
                        fontWeight: ativo ? 600 : 400,
                      }}
                    >
                      {ativo ? '✓ ' : ''}{c}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-cheio"
              style={{ alignSelf: 'flex-end', marginTop: '4px' }}
              onClick={confirmarDetalhesClinicos}
            >
              Confirmar Detalhes e Avançar →
            </button>
          </div>
        )}

        {/* Campo de Digitação Livre + Ditado por Voz (para Idade, Peso e Sintomas) */}
        {!esperando && (etapa === 'idade' || etapa === 'peso' || etapa === 'sintomas') && (
          <form className="ent-form" onSubmit={enviarEntradaTexto} style={{ display: 'flex', gap: '8px' }}>
            <input
              ref={inputRef}
              type="text"
              value={entrada}
              placeholder={
                etapa === 'idade'
                  ? 'Digite sua idade ou conte tudo de uma vez (ex: 32 anos, 70kg e dor de cabeça)...'
                  : etapa === 'peso'
                  ? 'Ex: 72 kg (ou escolha nos botões acima)...'
                  : 'Descreva livremente o que sente ou use os cartões acima...'
              }
              maxLength={300}
              onChange={(ev) => setEntrada(ev.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              className="btn btn-contorno"
              onClick={alternarReconhecimentoVoz}
              title="Ditar resposta usando o microfone"
              style={{
                padding: '0 12px',
                background: ouvindoVoz ? '#fee2e2' : undefined,
                borderColor: ouvindoVoz ? '#ef4444' : undefined,
                color: ouvindoVoz ? '#dc2626' : undefined,
              }}
            >
              {ouvindoVoz ? '🔴 Ouvindo...' : '🎤 Voz'}
            </button>
            <button
              type="submit"
              className="btn btn-cheio"
              onClick={(ev) => {
                if (etapa === 'sintomas' && sintomasSelecionados.length > 0 && !entrada.trim()) {
                  ev.preventDefault()
                  confirmarSintomasSelecionados()
                }
              }}
            >
              Enviar
            </button>
          </form>
        )}

        {/* 5. RESPOSTA AOS SINAIS DE ALERTA (RED FLAGS) */}
        {!esperando && etapa === 'risco' && (
          <div className="ent-opcoes-risco" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-cheio btn-perigo"
              onClick={() => responderRisco('sim')}
            >
              🚨 Sim, sinto esses sintomas de forma intensa
            </button>
            <button
              type="button"
              className="btn btn-contorno"
              style={{ borderColor: '#f59e0b', color: '#b45309', background: '#fffbeb' }}
              onClick={() => responderRisco('moderado')}
            >
              ⚠️ Sinto de forma leve ou apenas às vezes
            </button>
            <button
              type="button"
              className="btn btn-contorno"
              onClick={() => responderRisco('nao')}
            >
              ✅ Não, não sinto nenhum desses sinais
            </button>
          </div>
        )}

        {/* 6. AÇÕES FINAIS */}
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
