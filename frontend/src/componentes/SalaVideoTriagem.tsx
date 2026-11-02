import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: any) => any
  }
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

  // Nome sanitizado da sala
  const nomeSala = `TriageAI-${idSala.replace(/[^a-zA-Z0-9_-]/g, '') || 'Atendimento'}`

  useEffect(() => {
    let scriptEl = document.querySelector('script[src="https://meet.jit.si/external_api.js"]') as HTMLScriptElement | null

    const iniciarJitsi = () => {
      if (!window.JitsiMeetExternalAPI || !containerRef.current) {
        setErroScript(true)
        setCarregando(false)
        return
      }

      try {
        const domain = 'meet.jit.si'
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
            disableDeepLinking: true,
            enableWelcomePage: false,
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
        scriptEl.src = 'https://meet.jit.si/external_api.js'
        scriptEl.async = true
        document.body.appendChild(scriptEl)
      }

      scriptEl.onload = () => {
        iniciarJitsi()
      }
      scriptEl.onerror = () => {
        setErroScript(true)
        setCarregando(false)
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
  }, [nomeSala, nomeUsuario, papel, aoEncerrar])

  const linkDireto = `https://meet.jit.si/${nomeSala}`

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
        style={{ display: carregando || erroScript ? 'none' : 'block' }}
      />
    </div>
  )
}
