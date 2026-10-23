import { useState, type FormEvent } from 'react'
import { useIdioma } from '../i18n/idioma'
import type { Modo } from '../i18n/textos'
import LayoutAuth from '../componentes/LayoutAuth'
import ListaRequisitos from '../componentes/ListaRequisitos'
import { Olho, OlhoRiscado } from '../componentes/icones'
import { avaliarSenha, senhaValida } from '../auth/senha'
import { redefinirSenha } from '../auth/servicoAuth'

export default function RedefinirSenha({ modo }: { modo: Modo }) {
  const { t } = useIdioma()
  const d = t.redefinir
  const l = t.login
  const [senha, setSenha] = useState('')
  const [conf, setConf] = useState('')
  const [ver, setVer] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [feito, setFeito] = useState(false)

  const req = avaliarSenha(senha, conf)

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!senhaValida(req)) return
    setErro(null)
    setCarregando(true)
    try {
      await redefinirSenha(senha)
      setFeito(true)
    } catch {
      setErro(d.erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <LayoutAuth modo={modo} eyebrow={d.eyebrow} titulo={d.titulo} sub={d.sub} aviso={l[modo].aviso}
      voltar={{ href: `#/login/${modo}`, texto: t.recuperar.voltar }}>
      {feito ? (
        <div className="lg-card" role="status">
          <div>
            <h2 className="lg-card-titulo">{d.sucessoTitulo}</h2>
            <p className="lg-card-sub">{d.sucessoTexto}</p>
          </div>
          <a className="lg-entrar" href={`#/login/${modo}`}>{d.irLogin}</a>
        </div>
      ) : (
        <form className="lg-card" onSubmit={enviar}>
          <div className="lg-campo">
            <label className="lg-rotulo" htmlFor="nova">{d.nova}</label>
            <div className="lg-senha">
              <input id="nova" type={ver ? 'text' : 'password'} autoComplete="new-password" required
                value={senha} onChange={(e) => setSenha(e.target.value)} />
              <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? l.ocultar : l.mostrar} aria-pressed={ver}>
                {ver ? <OlhoRiscado /> : <Olho />}
              </button>
            </div>
          </div>
          <label className="lg-campo">
            <span className="lg-rotulo">{d.confirmar}</span>
            <input type={ver ? 'text' : 'password'} autoComplete="new-password" required
              value={conf} onChange={(e) => setConf(e.target.value)} />
          </label>

          <ListaRequisitos req={req} />

          {erro && <p className="lg-erro" role="alert">{erro}</p>}
          <button type="submit" className="lg-entrar" disabled={!senhaValida(req) || carregando}>{d.salvar}</button>
        </form>
      )}
    </LayoutAuth>
  )
}
