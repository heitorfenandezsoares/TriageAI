import { useEffect, useState, type FormEvent } from 'react'
import { useIdioma } from '../i18n/idioma'
import type { Modo } from '../i18n/textos'
import { Olho, OlhoRiscado, Cadeado } from '../componentes/icones'
import LayoutAuth from '../componentes/LayoutAuth'
import { useAuth } from '../auth/AuthContext'
import { CODIGO_MOCK, entrar, verificarCodigo } from '../auth/servicoAuth'
import { guardarToken } from '../api'
import type { Usuario } from '../auth/tipos'
import { navegar } from '../rotas/rota'

const EMAIL = /\S+@\S+\.\S+/

function Pagina({ modo }: { modo: Modo }) {
  const { t } = useIdioma()
  const { sessao, iniciarSessao } = useAuth()
  const l = t.login
  const m = l[modo]

  const [id, setId] = useState('')
  const [senha, setSenha] = useState('')
  const [ver, setVer] = useState(false)
  const [codigo, setCodigo] = useState('')
  // aguardando o código (MFA): o token só é guardado depois que o código for aceito
  const [pendente, setPendente] = useState<{ usuario: Usuario; token: string } | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  // Quem já está autenticado vai direto para a sua área
  useEffect(() => {
    if (sessao) navegar(sessao.usuario.perfil === 'paciente' ? '/paciente' : '/painel')
  }, [sessao])

  const enviarCredenciais = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro(null)
    if (!id.trim() || !senha.trim()) return setErro(l.erroCampos)
    if (modo === 'paciente' && !EMAIL.test(id.trim())) return setErro(l.erroEmail)

    setCarregando(true)
    try {
      const r = await entrar(id, senha, modo)
      if (r.etapa === 'mfa') {
        setPendente({ usuario: r.usuario, token: r.token })
      } else {
        guardarToken(r.token)
        iniciarSessao(r.usuario)
      }
    } catch (err) {
      setErro(err instanceof Error && err.message === 'rede' ? l.erroRede : l.erroCredenciais)
    } finally {
      setCarregando(false)
    }
  }

  const enviarCodigo = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!pendente) return
    setErro(null)
    setCarregando(true)
    try {
      await verificarCodigo(codigo)
      guardarToken(pendente.token)
      iniciarSessao(pendente.usuario)
    } catch {
      setErro(l.mfa.erro)
      setCodigo('')
    } finally {
      setCarregando(false)
    }
  }

  const voltarParaCredenciais = () => {
    setPendente(null)
    setCodigo('')
    setSenha('')
    setErro(null)
  }

  return (
    <LayoutAuth modo={modo} eyebrow={m.eyebrow} titulo={m.titulo} sub={m.sub} aviso={m.aviso}
      voltar={{ href: '#/', texto: l.voltar }}>
      {pendente ? (
        <form className="lg-card" onSubmit={enviarCodigo}>
          <div>
            <h2 className="lg-card-titulo">{l.mfa.titulo}</h2>
            <p className="lg-card-sub">{l.mfa.sub}</p>
          </div>

          <label className="lg-campo">
            <span className="lg-rotulo">{l.mfa.campo}</span>
            <input
              className="lg-codigo" type="text" name="codigo" inputMode="numeric"
              autoComplete="one-time-code" maxLength={6} pattern="\d{6}" required autoFocus
              placeholder={l.mfa.ph} value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
          </label>

          {erro && <p className="lg-erro" role="alert">{erro}</p>}

          <button type="submit" className="lg-entrar" disabled={carregando || codigo.length !== 6}>
            <Cadeado width={18} height={18} /> {carregando ? l.verificando : l.mfa.verificar}
          </button>
          <p className="lg-criar">
            <button type="button" className="lg-link lg-link-botao" onClick={voltarParaCredenciais}>
              {l.mfa.trocar}
            </button>
          </p>
          {import.meta.env.DEV && <p className="lg-dica">Demonstração: código {CODIGO_MOCK}</p>}
        </form>
      ) : (
        <form className="lg-card" onSubmit={enviarCredenciais} noValidate>
          <label className="lg-campo">
            <span className="lg-rotulo">{m.campo}</span>
            <input type={modo === 'paciente' ? 'email' : 'text'} name="usuario" autoComplete="username" required
              placeholder={m.ph} value={id} onChange={(e) => setId(e.target.value)} />
          </label>

          <div className="lg-campo">
            <div className="lg-linha">
              <label className="lg-rotulo" htmlFor="senha">{l.senha}</label>
              <a className="lg-link" href={`#/recuperar-senha/${modo}`}>{l.esqueci}</a>
            </div>
            <div className="lg-senha">
              <input id="senha" type={ver ? 'text' : 'password'} name="senha"
                autoComplete="current-password" required placeholder={l.senhaPh}
                value={senha} onChange={(e) => setSenha(e.target.value)} />
              <button type="button" onClick={() => setVer(!ver)}
                aria-label={ver ? l.ocultar : l.mostrar} aria-pressed={ver}>
                {ver ? <OlhoRiscado /> : <Olho />}
              </button>
            </div>
          </div>

          {erro && <p className="lg-erro" role="alert">{erro}</p>}

          <button type="submit" className="lg-entrar" disabled={carregando}>
            <Cadeado width={18} height={18} /> {carregando ? l.carregando : l.entrar}
          </button>

          {/* Cadastro só para pacientes; profissionais recebem acesso da instituição */}
          {modo === 'paciente' ? (
            <p className="lg-criar">{l.semConta} <a className="lg-link" href="#/criar-conta">{l.criar}</a></p>
          ) : (
            <p className="lg-criar">{l.semContaProf}</p>
          )}
        </form>
      )}
    </LayoutAuth>
  )
}

export default function Login({ modo }: { modo: Modo }) {
  return <Pagina key={modo} modo={modo} />
}
