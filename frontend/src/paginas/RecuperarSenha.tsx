import { useState, type FormEvent } from 'react'
import { useIdioma } from '../i18n/idioma'
import type { Modo } from '../i18n/textos'
import LayoutAuth from '../componentes/LayoutAuth'
import { solicitarRecuperacao } from '../auth/servicoAuth'
import { navegar } from '../rotas/rota'

export default function RecuperarSenha({ modo }: { modo: Modo }) {
  const { t } = useIdioma()
  const r = t.recuperar
  const m = t.login[modo]
  const [id, setId] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro(null)
    setCarregando(true)
    try {
      await solicitarRecuperacao(id)
      setEnviado(true)
    } catch {
      setErro(r.erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <LayoutAuth modo={modo} eyebrow={r.eyebrow} titulo={r.titulo} sub={r.sub} aviso={m.aviso}
      voltar={{ href: `#/login/${modo}`, texto: r.voltar }}>
      {enviado ? (
        <div className="lg-card" role="status">
          <div>
            <h2 className="lg-card-titulo">{r.enviadoTitulo}</h2>
            <p className="lg-card-sub">{r.enviado}</p>
          </div>

          {import.meta.env.DEV && (
            <button type="button" className="lg-entrar" onClick={() => navegar(`/redefinir-senha/${modo}`)}>
              {r.simular}
            </button>
          )}
        </div>
      ) : (
        <form className="lg-card" onSubmit={enviar}>
          <label className="lg-campo">
            <span className="lg-rotulo">{m.campo}</span>
            <input type="text" name="usuario" autoComplete="username" required placeholder={m.ph}
              value={id} onChange={(e) => setId(e.target.value)} />
          </label>
          {erro && <p className="lg-erro" role="alert">{erro}</p>}
          <button type="submit" className="lg-entrar" disabled={carregando}>{r.enviar}</button>
        </form>
      )}
    </LayoutAuth>
  )
}
