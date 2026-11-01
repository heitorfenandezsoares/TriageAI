import { useIdioma } from '../i18n/idioma'
import { IDIOMAS, type Idioma } from '../i18n/textos'

// Cabeçalho das páginas públicas: início, sobre nós e entrevista.
export default function CabecalhoPublico() {
  const { lang, setLang, t } = useIdioma()
  return (
    <header className="topo">
      <a className="logo" href="#/">TriageAi</a>
      <nav className="menu" aria-label={t.nav.principal}>
        <a href="#/sobre">{t.nav.sobre}</a>
        <a href="#contato">{t.nav.contato ?? 'Contato'}</a>
        <button type="button" className="menu-item">{t.nav.empresas} ▾</button>
        <select className="seletor-idioma" value={lang} onChange={(e) => setLang(e.target.value as Idioma)} aria-label={t.nav.idioma}>
          {IDIOMAS.map((i) => <option key={i.codigo} value={i.codigo}>{i.rotulo}</option>)}
        </select>
      </nav>
      <div className="acoes">
        <a className="btn btn-cheio" href="#/login/paciente">{t.nav.paciente}</a>
        <a className="btn btn-contorno" href="#/login/profissional">{t.nav.profissional}</a>
      </div>
    </header>
  )
}
