import { useEffect, useRef, useState } from 'react'
import { mensagemErroVideo, obterSessaoVideo, type SessaoVideo } from '../dados/servicoTelemedicina'

declare global {
  interface Window {
    JitsiMeetExternalAPI?: new (domain: string, options: any) => any
  }
}

/** Extrai o código da sala de um link colado (`...?sala=CODIGO`); texto simples volta como veio. */
export function extrairCodigoSala(entrada: string): string {
  if (!entrada) return ''
  const trimmed = entrada.trim()
  const matchSala = trimmed.match(/[?&]sala=([^&#]+)/)
  return matchSala ? decodeURIComponent(matchSala[1]) : trimmed
}

interface SalaVideoTriagemProps {
  /** Código da sala criado pelo backend (não é o nome da sala no provedor). */
  sala: string
  nomeUsuario: string
  papel?: 'paciente' | 'profissional'
  aoEncerrar: () => void
}

const ERRO_SCRIPT = 'Não foi possível carregar o vídeo (verifique bloqueadores de anúncios ou a conexão).'

export default function SalaVideoTriagem({
  sala,
  nomeUsuario,
  papel = 'paciente',
  aoEncerrar,
}: SalaVideoTriagemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const aoEncerrarRef = useRef(aoEncerrar)
  useEffect(() => { aoEncerrarRef.current = aoEncerrar })
  const [sessao, setSessao] = useState<SessaoVideo | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // 1) Pede ao backend a permissão (token) para entrar nesta sala.
  // Quem usa o componente passa key={sala}: outra sala = componente novo, estado limpo.
  useEffect(() => {
    let ativo = true
    obterSessaoVideo(sala)
      .then((s) => { if (ativo) setSessao(s) })
      .catch((e) => {
        if (!ativo) return
        setErro(mensagemErroVideo(e))
        setCarregando(false)
      })
    return () => { ativo = false }
  }, [sala])

  // 2) Com a sessão em mãos, carrega o script do provedor e abre a sala
  useEffect(() => {
    if (!sessao) return
    const scriptSrc = `https://${sessao.domain}/${sessao.appId}/external_api.js`
    let cancelado = false

    const iniciar = () => {
      if (cancelado) return
      if (!window.JitsiMeetExternalAPI || !containerRef.current) {
        setErro(ERRO_SCRIPT)
        setCarregando(false)
        return
      }
      try {
        const api = new window.JitsiMeetExternalAPI(sessao.domain, {
          roomName: sessao.roomName,
          jwt: sessao.jwt,
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
              'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen', 'fodeviceselection',
              'hangup', 'chat', 'etherpad', 'sharedvideo', 'settings', 'raisehand', 'videoquality',
              'filmstrip', 'feedback', 'stats', 'shortcuts', 'tileview',
            ],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
        })
        apiRef.current = api
        // O iframe já existe: libera a tela para o usuário conceder câmera e microfone
        setCarregando(false)
        api.addEventListener('videoConferenceLeft', () => aoEncerrarRef.current())
      } catch (err) {
        console.error('Erro ao inicializar a sala de vídeo:', err)
        setErro('Não foi possível iniciar a sala de vídeo.')
        setCarregando(false)
      }
    }

    if (window.JitsiMeetExternalAPI) {
      iniciar()
    } else {
      let scriptEl = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null
      if (!scriptEl) {
        scriptEl = document.createElement('script')
        scriptEl.src = scriptSrc
        scriptEl.async = true
        document.body.appendChild(scriptEl)
      }
      scriptEl.onload = iniciar
      scriptEl.onerror = () => {
        scriptEl?.remove() // a próxima tentativa recria a tag, em vez de esperar um onload que nunca vem
        if (cancelado) return
        setErro(ERRO_SCRIPT)
        setCarregando(false)
      }
    }

    return () => {
      cancelado = true
      const pendente = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement | null
      if (pendente) { pendente.onload = null; pendente.onerror = null }
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [sessao, nomeUsuario, papel])

  return (
    <div className="video-triagem-box">
      <div className="video-triagem-barra">
        <div className="video-triagem-info">
          <h3>📹 Tele-Triagem por Vídeo ao Vivo</h3>
          <span className="badge badge-sucesso">Transmissão Criptografada</span>
        </div>

        <div className="video-triagem-acoes">
          <button type="button" className="btn btn-perigo btn-sm" onClick={aoEncerrar}>
            ✕ Encerrar Vídeo
          </button>
        </div>
      </div>

      {carregando && !erro && (
        <div className="video-triagem-carregando">
          <div className="video-spinner" />
          <p>Conectando com a sala de vídeo segura...</p>
          <small>Por favor, autorize o acesso à câmera e microfone quando o navegador solicitar.</small>
        </div>
      )}

      {erro && (
        <div className="video-triagem-erro">
          <p>{erro}</p>
        </div>
      )}

      <div
        ref={containerRef}
        className="video-triagem-frame"
        style={{ display: erro ? 'none' : 'block' }}
      />
    </div>
  )
}
