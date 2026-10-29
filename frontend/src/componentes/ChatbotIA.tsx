import { useState, useRef, useEffect, type FormEvent } from 'react'
import './ChatbotIA.css'

export interface MensagemChat {
  id: string
  autor: 'bot' | 'eu'
  texto: string
  hora: string
}

interface ChatbotIAProps {
  abertoInicial?: boolean
  abertoControlado?: boolean
  onToggleAberto?: (aberto: boolean) => void
}

const CHIPS_SUGESTOES = [
  'O que é o TriageAI?',
  'Quais são os serviços?',
  'Como acessar a Área do Paciente?',
  'Como acessar a Área Profissional?',
  'Protocolo de Manchester',
  'Página de Contato',
]

const MENSAGEM_BOAS_VINDAS =
  'Olá! Seja muito bem-vindo(a) à **TriageAI**! 👋\n\n' +
  'Sou o assistente virtual da plataforma. Meu objetivo é dar as boas-vindas aos visitantes na página principal, tirar dúvidas gerais sobre nossa empresa e serviços, e ajudar você a encontrar o que procura.\n\n' +
  'Como posso te ajudar hoje?'

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Motor de respostas do Chatbot com base nas diretrizes:
 * - Dar as boas-vindas aos visitantes na página principal
 * - Tirar dúvidas gerais sobre nossa empresa e serviços
 * - Ajudar o usuário a encontrar o que procura
 * - Sempre amigável, educado, claro e conciso
 * - Se não souber alguma informação, orientar o usuário a procurar a página de 'Contato'
 */
export function responderChatbot(pergunta: string): string {
  const p = normalizar(pergunta)

  // Saudações
  if (/^(oi|ola|bom dia|boa tarde|boa noite|opa|ola tudo bem|e ai|tudo bem)/.test(p)) {
    return (
      'Olá! Seja muito bem-vindo(a) à TriageAI! Tudo ótimo por aqui, e com você? 😊\n\n' +
      'Estou à disposição para tirar qualquer dúvida sobre nossa empresa, explicar nossos serviços de triagem hospitalar com IA ou te orientar sobre onde encontrar o que precisa. Em que posso te ajudar?'
    )
  }

  // Sobre a empresa / Quem somos / TriageAI
  if (
    p.includes('quem sao') ||
    p.includes('quem e') ||
    p.includes('sobre a empresa') ||
    p.includes('sobre o triageai') ||
    p.includes('o que e o triageai') ||
    p.includes('o que e a triageai') ||
    p.includes('missao') ||
    p.includes('empresa') ||
    p.includes('tcc') ||
    p.includes('projeto')
  ) {
    return (
      'A **TriageAI** é uma plataforma inteligente desenvolvida para modernizar e agilizar o fluxo de triagem em prontos-socorros e hospitais.\n\n' +
      'Combinamos inteligência artificial preditiva com o consagrado **Protocolo de Manchester** para classificar riscos rapidamente, mitigar tempos de espera e apoiar a equipe médica com total segurança e explicabilidade clínica.'
    )
  }

  // Serviços oferecidos
  if (
    p.includes('servico') ||
    p.includes('funcionalidade') ||
    p.includes('recurso') ||
    p.includes('o que voces fazem') ||
    p.includes('o que oferecem') ||
    p.includes('solucao') ||
    p.includes('produto')
  ) {
    return (
      'Nossos principais serviços incluem:\n' +
      '• **Triagem Inteligente (IA):** Sugestão de classificação de risco Manchester baseada em sinais vitais.\n' +
      '• **Painel em Tempo Real:** Monitoramento dinâmico da fila e priorização imediata dos casos mais críticos.\n' +
      '• **Gestão de Leitos:** Visão em tempo real da ocupação em UTI, enfermaria e observação.\n' +
      '• **Área do Paciente:** Acompanhamento transparente da fila de espera e pré-triagem guiada online.\n' +
      '• **Inteligência Explicável (XAI):** Transparência médica com os fatores clínicos determinantes (SHAP).'
    )
  }

  // Protocolo de Manchester e Cores
  if (
    p.includes('manchester') ||
    p.includes('protocolo') ||
    p.includes('cores') ||
    p.includes('vermelho') ||
    p.includes('laranja') ||
    p.includes('amarelo') ||
    p.includes('verde') ||
    p.includes('azul') ||
    p.includes('classificacao de risco')
  ) {
    return (
      'A triagem do TriageAI adota o **Protocolo de Manchester**, que organiza a prioridade em 5 níveis de gravidade:\n' +
      '• 🔴 **Vermelho (Emergência):** Atendimento imediato (0 min)\n' +
      '• 🟠 **Laranja (Muito urgente):** Até 10 min\n' +
      '• 🟡 **Amarelo (Urgente):** Até 60 min\n' +
      '• 🟢 **Verde (Pouco urgente):** Até 120 min\n' +
      '• 🔵 **Azul (Não urgente):** Até 240 min\n\n' +
      'Nossa IA analisa parâmetros vitais (pressão, saturação, frequência cardíaca, etc.) para apoiar a recomendação mais precisa.'
    )
  }

  // Área do Paciente
  if (
    p.includes('paciente') ||
    p.includes('sou paciente') ||
    p.includes('espera') ||
    p.includes('tempo de espera') ||
    p.includes('minha vez') ||
    p.includes('minha fila') ||
    p.includes('pre-triagem') ||
    p.includes('entrevista')
  ) {
    return (
      'Se você é paciente ou acompanhante, pode acompanhar o andamento da fila ou iniciar sua pré-triagem online!\n\n' +
      'Para isso, acesse a [Área do Paciente](#/login/paciente) pelo menu superior ou pelo botão principal da página.'
    )
  }

  // Área Profissional / Médicos / Enfermeiros / Triagem Clínica
  if (
    p.includes('profissional') ||
    p.includes('medico') ||
    p.includes('enfermeir') ||
    p.includes('triagista') ||
    p.includes('login profissional') ||
    p.includes('painel') ||
    p.includes('triagem') ||
    p.includes('nova triagem')
  ) {
    return (
      'Profissionais de saúde (médicos, enfermeiros e equipes hospitalares) contam com um painel em tempo real e a ferramenta de triagem clínica assistida por IA.\n\n' +
      'Você pode acessar a [Área Profissional](#/login/profissional) ou ir direto para a página de [Triagem](#/triagem).'
    )
  }

  // Como a IA funciona / Modelos / Explicabilidade
  if (
    p.includes('inteligencia artificial') ||
    p.includes('como funciona a ia') ||
    p.includes('modelo') ||
    p.includes('algoritmo') ||
    p.includes('xgboost') ||
    p.includes('shap') ||
    p.includes('explicabilidade') ||
    p.includes('xai')
  ) {
    return (
      'Nossa IA utiliza modelos de Machine Learning (como XGBoost) treinados com indicadores vitais clínicos.\n\n' +
      'Além de sugerir a prioridade, o TriageAI exibe os **fatores SHAP**, mostrando com transparência quais sinais justificaram a decisão para que o profissional de saúde valide com total autonomia.'
    )
  }

  // Preços / Contratação / Empresas / Hospitais
  if (
    p.includes('preco') ||
    p.includes('quanto custa') ||
    p.includes('valor') ||
    p.includes('planos') ||
    p.includes('contratar') ||
    p.includes('empresa') ||
    p.includes('hospital') ||
    p.includes('clinica') ||
    p.includes('parceria')
  ) {
    return (
      'Possuímos soluções e integrações personalizadas para hospitais, clínicas e redes de atendimento.\n\n' +
      'Para conhecer nossos planos institucionais ou agendar uma demonstração exclusiva com nossa equipe comercial, por favor procure a nossa página de [Contato](#contato)!'
    )
  }

  // Segurança e LGPD
  if (
    p.includes('seguranca') ||
    p.includes('lgpd') ||
    p.includes('privacidade') ||
    p.includes('dados') ||
    p.includes('protecao')
  ) {
    return (
      'A segurança dos seus dados é prioridade máxima. O TriageAI está em total conformidade com a **LGPD** e com padrões de interoperabilidade em saúde (**HL7 FHIR**).\n\n' +
      'Todos os dados clínicos de pacientes são confidenciais e protegidos por criptografia de ponta a ponta.'
    )
  }

  // Contato / Falar com humano / Suporte
  if (
    p.includes('contato') ||
    p.includes('falar com') ||
    p.includes('atendente') ||
    p.includes('humano') ||
    p.includes('suporte') ||
    p.includes('telefone') ||
    p.includes('email') ||
    p.includes('whatsapp')
  ) {
    return (
      'Nossa equipe está pronta para te atender! Você pode falar conosco pelos canais disponíveis na nossa página de [Contato](#contato):\n' +
      '• **E-mail:** contato@triageai.com.br\n' +
      '• **Telefone:** (11) 4002-8922\n' +
      '• **Horário:** Segunda a Sexta, das 8h às 18h\n\n' +
      'Ficaremos felizes em te ajudar!'
    )
  }

  // Agradecimento / Despedida
  if (
    p.includes('obrigad') ||
    p.includes('valeu') ||
    p.includes('agradeco') ||
    p.includes('tchau') ||
    p.includes('ate mais') ||
    p.includes('bom descanso')
  ) {
    return (
      'Por nada! Fico muito feliz em ajudar. Seja sempre bem-vindo(a) à TriageAI! 😊\n\n' +
      'Se precisar de mais alguma informação, estou por aqui ou você pode procurar nossa página de [Contato](#contato). Tenha um excelente dia!'
    )
  }

  // Regra padrão: Se não souber alguma informação, oriente o usuário a procurar a página de 'Contato'
  return (
    'Não tenho essa informação específica no momento. Recomendo que procure a nossa página de [Contato](#contato) para falar diretamente com a nossa equipe e tirar todas as suas dúvidas!\n\n' +
    'Posso te ajudar com mais alguma informação sobre nossos serviços ou navegação na plataforma?'
  )
}

function horaAtual(): string {
  const agora = new Date()
  return agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Renderiza textos simples com suporte a links no formato [Texto](#href) e **negrito**
 */
function renderizarTexto(texto: string, aoClicarLink?: (href: string) => void) {
  // Separa por parágrafos / linhas
  const linhas = texto.split('\n')
  return linhas.map((linha, li) => {
    if (!linha.trim()) return <br key={li} />

    // Trata listas com bullet
    const ehBullet = linha.trim().startsWith('•')
    const conteudoLinha = ehBullet ? linha.trim().substring(1).trim() : linha

    // Expressão regular para encontrar links [rótulo](url) ou negrito **texto**
    const partes: (string | { tipo: 'link'; texto: string; href: string } | { tipo: 'bold'; texto: string })[] = []
    let cursor = 0
    const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(conteudoLinha)) !== null) {
      if (match.index > cursor) {
        partes.push(conteudoLinha.substring(cursor, match.index))
      }
      if (match[1] && match[2]) {
        // Link markdown
        partes.push({ tipo: 'link', texto: match[1], href: match[2] })
      } else if (match[3]) {
        // Negrito
        partes.push({ tipo: 'bold', texto: match[3] })
      }
      cursor = regex.lastIndex
    }
    if (cursor < conteudoLinha.length) {
      partes.push(conteudoLinha.substring(cursor))
    }

    const filhos = partes.map((p, i) => {
      if (typeof p === 'string') return p
      if (p.tipo === 'link') {
        return (
          <a
            key={i}
            href={p.href}
            onClick={(e) => {
              if (p.href.startsWith('#')) {
                // Se for âncora interna como #contato, rola suavemente
                const elemento = document.querySelector(p.href)
                if (elemento) {
                  e.preventDefault()
                  elemento.scrollIntoView({ behavior: 'smooth' })
                }
              }
              aoClicarLink?.(p.href)
            }}
          >
            {p.texto}
          </a>
        )
      }
      return <strong key={i}>{p.texto}</strong>
    })

    if (ehBullet) {
      return (
        <div key={li} style={{ display: 'flex', gap: '6px', margin: '3px 0' }}>
          <span>•</span>
          <div>{filhos}</div>
        </div>
      )
    }

    return (
      <p key={li} style={{ margin: '4px 0' }}>
        {filhos}
      </p>
    )
  })
}

export default function ChatbotIA({ abertoInicial = false, abertoControlado, onToggleAberto }: ChatbotIAProps) {
  const [abertoInterno, setAbertoInterno] = useState(abertoInicial)
  const [mensagens, setMensagens] = useState<MensagemChat[]>([
    {
      id: 'boas-vindas',
      autor: 'bot',
      texto: MENSAGEM_BOAS_VINDAS,
      hora: horaAtual(),
    },
  ])
  const [digitando, setDigitando] = useState(false)
  const [inputTexto, setInputTexto] = useState('')
  const corpoRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const aberto = abertoControlado !== undefined ? abertoControlado : abertoInterno

  const toggleAberto = (novoEstado: boolean) => {
    if (abertoControlado === undefined) {
      setAbertoInterno(novoEstado)
    }
    onToggleAberto?.(novoEstado)
  }

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (aberto && corpoRef.current) {
      corpoRef.current.scrollTo({
        top: corpoRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [mensagens, digitando, aberto])

  // Foco no input ao abrir
  useEffect(() => {
    if (aberto) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [aberto])

  const enviarPergunta = (texto: string) => {
    const textoLimpo = texto.trim()
    if (!textoLimpo || digitando) return

    const novaMsgEu: MensagemChat = {
      id: `eu-${Date.now()}`,
      autor: 'eu',
      texto: textoLimpo,
      hora: horaAtual(),
    }

    setMensagens((anteriores) => [...anteriores, novaMsgEu])
    setInputTexto('')
    setDigitando(true)

    // Pequena pausa (600ms) para simular o processamento da IA
    setTimeout(() => {
      const respostaTexto = responderChatbot(textoLimpo)
      const novaMsgBot: MensagemChat = {
        id: `bot-${Date.now()}`,
        autor: 'bot',
        texto: respostaTexto,
        hora: horaAtual(),
      }
      setMensagens((anteriores) => [...anteriores, novaMsgBot])
      setDigitando(false)
    }, 600)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    enviarPergunta(inputTexto)
  }

  const limparConversa = () => {
    setMensagens([
      {
        id: `boas-vindas-${Date.now()}`,
        autor: 'bot',
        texto: MENSAGEM_BOAS_VINDAS,
        hora: horaAtual(),
      },
    ])
  }

  return (
    <>
      {/* Botão Flutuante */}
      {!aberto && (
        <button
          type="button"
          className="chatbot-botao-flutuante"
          onClick={() => toggleAberto(true)}
          aria-label="Abrir assistente virtual com IA"
        >
          <div className="chatbot-icone-wrapper">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="chatbot-ponto-status" />
          </div>
          <span>Chat com IA</span>
        </button>
      )}

      {/* Janela do Chatbot */}
      {aberto && (
        <section className="chatbot-janela" role="dialog" aria-label="Chatbot com IA TriageAI">
          {/* Cabeçalho */}
          <header className="chatbot-topo">
            <div className="chatbot-topo-info">
              <div className="chatbot-avatar" aria-hidden="true">
                🤖
              </div>
              <div className="chatbot-identidade">
                <h3>Assistente TriageAI</h3>
                <p>
                  <span className="chatbot-topo-status-dot" />
                  Online • Boas-vindas e Dúvidas
                </p>
              </div>
            </div>
            <div className="chatbot-topo-acoes">
              <button
                type="button"
                className="chatbot-btn-acao"
                title="Limpar conversa"
                onClick={limparConversa}
                aria-label="Limpar histórico da conversa"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button
                type="button"
                className="chatbot-btn-acao"
                title="Fechar chat"
                onClick={() => toggleAberto(false)}
                aria-label="Fechar janela do chat"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Área de Mensagens */}
          <div className="chatbot-corpo" ref={corpoRef} role="log" aria-live="polite">
            {mensagens.map((msg) => (
              <div key={msg.id} className={`chatbot-mensagem ${msg.autor}`}>
                <div className="chatbot-bolha">
                  {renderizarTexto(msg.texto)}
                </div>
                <span className="chatbot-hora">{msg.hora}</span>
              </div>
            ))}

            {digitando && (
              <div className="chatbot-mensagem bot">
                <div className="chatbot-digitando" aria-label="Assistente digitando">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          {/* Sugestões Rápidas (Chips) */}
          <div className="chatbot-chips" aria-label="Perguntas frequentes">
            {CHIPS_SUGESTOES.map((chip) => (
              <button
                key={chip}
                type="button"
                className="chatbot-chip"
                onClick={() => enviarPergunta(chip)}
                disabled={digitando}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Rodapé / Input de Envio */}
          <footer className="chatbot-rodape">
            <form className="chatbot-form" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                placeholder="Tire dúvidas sobre a empresa ou serviços..."
                value={inputTexto}
                onChange={(e) => setInputTexto(e.target.value)}
                disabled={digitando}
                aria-label="Mensagem para o assistente virtual"
              />
              <button
                type="submit"
                className="chatbot-btn-enviar"
                disabled={!inputTexto.trim() || digitando}
                title="Enviar mensagem"
                aria-label="Enviar mensagem"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <p className="chatbot-aviso-rodape">
              Inteligência Artificial TriageAI • Se não soubermos, orientamos você ao Contato.
            </p>
          </footer>
        </section>
      )}
    </>
  )
}
