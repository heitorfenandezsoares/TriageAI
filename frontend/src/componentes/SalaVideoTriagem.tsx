import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: any) => any
  }
}

export function extrairCodigoSala(entrada: string): string {
  if (!entrada) return ''
  const trimmed = entrada.trim()
  // 1. Se colou uma URL completa com query param (ex: .../#/entrevista?sala=Tele-Gestor-2388 ou ?sala=...)
  const matchSala = trimmed.match(/[?&]sala=([^&#]+)/)
  if (matchSala) return decodeURIComponent(matchSala[1])
  // 2. Se colou uma URL do Jitsi (ex: meet.jit.si/TriageAI-... ou meet.ffmuc.net/TriageAI-...)
  const matchJitsi = trimmed.match(/(?:meet\.jit\.si|meet\.ffmuc\.net|calls\.disroot\.org)\/([^/?#]+)/)
  if (matchJitsi) return decodeURIComponent(matchJitsi[1]).replace(/^TriageAI-/, '')
  // 3. Se digitou com o prefixo TriageAI-
  return trimmed.replace(/^TriageAI-/, '')
}

interface SalaVideoTriagemProps {
  idSala: string
  nomeUsuario: string
  papel?: 'paciente' | 'profissional'
  aoEncerrar: () => void
}

export default function SalaVideoTriagem({
  idSala,
  nomeUsuario,
  papel = 'paciente',
  aoEncerrar,
}: SalaVideoTriagemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const [carregando, setCarregando] = useState(true)
  const [erroScript, setErroScript] = useState(false)
  const [servidor, setServidor] = useState<'ffmuc' | 'jitsi'>('ffmuc')

  // Nome sanitizado da sala (limpa caso tenham colado a URL inteira)
  const codigoLimpo = extrairCodigoSala(idSala).replace(/[^a-zA-Z0-9_-]/g, '') || 'Atendimento'
  const nomeSala = `TriageAI-${codigoLimpo}`
  const domain = servidor === 'ffmuc' ? 'meet.ffmuc.net' : 'meet.jit.si'

  useEffect(() => {
    const scriptSrc = `https://${domain}/external_api.js`
    let scriptEl = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null

    const iniciarJitsi = () => {
      if (!window.JitsiMeetExternalAPI || !containerRef.current) {
        setErroScript(true)
        setCarregando(false)
        return
      }

      try {
        const options = {
          roomName: nomeSala,
          width: '100%',
          height: '100%',
          parentNode: containerRef.current,
          userInfo: {
            displayName: papel === 'profissional' ? `Profissional: ${nomeUsuario}` : `Paciente: ${nomeUsuario}`,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            prejoinConfig: { enabled: false },
            disableDeepLinking: true,
            enableWelcomePage: false,
            enableClosePage: false,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'chat',
              'recording',
              'livestreaming',
              'etherpad',
              'sharedvideo',
              'settings',
              'raisehand',
              'videoquality',
              'filmstrip',
              'feedback',
              'stats',
              'shortcuts',
              'tileview',
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
        }

        const api = new window.JitsiMeetExternalAPI(domain, options)
        apiRef.current = api

        // Iframe já criado; desativa o spinner local para o usuário poder interagir e conceder permissões
        setCarregando(false)

        api.addEventListener('videoConferenceJoined', () => {
          setCarregando(false)
        })

        api.addEventListener('videoConferenceLeft', () => {
          aoEncerrar()
        })
      } catch (err) {
        console.error('Erro ao inicializar Jitsi Meet:', err)
        setErroScript(true)
        setCarregando(false)
      }
    }

    if (!window.JitsiMeetExternalAPI) {
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.src = scriptSrc
        scriptEl.async = true
        document.body.appendChild(scriptEl)
      }

      scriptEl.onload = () => {
        iniciarJitsi()
      }
      scriptEl.onerror = () => {
        if (servidor === 'ffmuc') {
          setServidor('jitsi')
        } else {
          setErroScript(true)
          setCarregando(false)
        }
      }
    } else {
      iniciarJitsi()
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose?.()
        apiRef.current = null
      }
    }
  }, [nomeSala, nomeUsuario, papel, aoEncerrar, domain, servidor])

  const linkDireto = `https://${domain}/${nomeSala}`

  return (
    <div className="video-triagem-box">
      <div className="video-triagem-barra">
        <div className="video-triagem-info">
          <h3>📹 Tele-Triagem por Vídeo ao Vivo</h3>
          <span className="badge badge-sucesso">Transmissão Criptografada</span>
          <span className="video-triagem-sala">Sala: <strong>{nomeSala}</strong></span>
        </div>

        <div className="video-triagem-acoes">
          <a
            className="btn btn-contorno btn-sm"
            href={linkDireto}
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir em nova aba do navegador"
          >
            ↗ Abrir em Nova Aba
          </a>
          <button type="button" className="btn btn-perigo btn-sm" onClick={aoEncerrar}>
            ✕ Encerrar Vídeo
          </button>
        </div>
      </div>

      <div style={{ background: '#0f172a', padding: '8px 16px', borderBottom: '1px solid #1e293b', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span>🔒 Transmissão direta sem moderação/login. Se travar, clique em <strong style={{ color: '#38bdf8' }}>↗ Abrir em Nova Aba</strong>.</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>Sala: <strong style={{ color: '#f1f5f9' }}>{nomeSala}</strong></span>
          <button
            type="button"
            className="btn btn-sm btn-contorno"
            style={{ fontSize: '0.72rem', padding: '2px 8px', color: '#cbd5e1', borderColor: '#475569' }}
            onClick={() => setServidor(s => s === 'ffmuc' ? 'jitsi' : 'ffmuc')}
            title="Alternar servidor de videoconferência"
          >
            Servidor: {servidor === 'ffmuc' ? 'Livre (Sem Login)' : 'meet.jit.si'}
          </button>
        </div>
      </div>

      {carregando && (
        <div className="video-triagem-carregando">
          <div className="video-spinner" />
          <p>Conectando com a sala de vídeo segura...</p>
          <small>Por favor, autorize o acesso à câmera e microfone quando o navegador solicitar.</small>
        </div>
      )}

      {erroScript && (
        <div className="video-triagem-erro">
          <p>Não foi possível carregar a visualização de vídeo embutida (pode ser bloqueador de anúncios ou conexão restrita).</p>
          <a className="btn btn-cheio" href={linkDireto} target="_blank" rel="noopener noreferrer">
            Abrir Sala de Tele-Triagem no Navegador →
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        className="video-triagem-frame"
        style={{ display: erroScript ? 'none' : 'block' }}
      />
    </div>
  )
}
