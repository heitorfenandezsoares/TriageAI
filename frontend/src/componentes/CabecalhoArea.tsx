import { useAuth } from '../auth/AuthContext'
import { useIdioma } from '../i18n/idioma'
import { IDIOMAS, type Idioma } from '../i18n/textos'
import { navegar } from '../rotas/rota'

export default function CabecalhoArea() {
  const { sessao, sair } = useAuth()
  const { lang, setLang, t } = useIdioma()
  if (!sessao) return null
  const { nome, perfil } = sessao.usuario

  const aoSair = () => {
    navegar('/')
    sair()
  }

  return (
    <header className="ar-topo">
      <a className="logo" href="#/">TriageAi</a>
      <div className="ar-usuario">
        <span><strong>{nome}</strong> · {t.area.perfis[perfil]}</span>
        <select className="seletor-idioma" value={lang} onChange={(e) => setLang(e.target.value as Idioma)} aria-label={t.nav.idioma}>
          {IDIOMAS.map((i) => <option key={i.codigo} value={i.codigo}>{i.rotulo}</option>)}
        </select>
        <button type="button" className="btn btn-contorno" onClick={aoSair}>{t.area.sair}</button>
      </div>
    </header>
  )
}
