import PainelDemo from '../componentes/PainelDemo'
import { useIdioma, rico } from '../i18n/idioma'
import { IDIOMAS, type Idioma } from '../i18n/textos'

export default function Home() {
  const { lang, setLang, t } = useIdioma()

  return (
    <>
      <header className="topo">
        <a className="logo" href="#inicio">TriageAi</a>
        <nav className="menu" aria-label={t.nav.principal}>
          <a href="#sobre">{t.nav.sobre}</a>
          <button type="button" className="menu-item">{t.nav.empresas} ▾</button>
          <select
            className="seletor-idioma"
            value={lang}
            onChange={(e) => setLang(e.target.value as Idioma)}
            aria-label={t.nav.idioma}
          >
            {IDIOMAS.map((i) => (
              <option key={i.codigo} value={i.codigo}>{i.rotulo}</option>
            ))}
          </select>
        </nav>
        <div className="acoes">
          <a className="btn btn-cheio" href="#/login/paciente">{t.nav.paciente}</a>
          <a className="btn btn-contorno" href="#/login/profissional">{t.nav.profissional}</a>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-texto">
            <h1>{t.hero.titulo}</h1>
            <ul className="beneficios">
              {t.hero.beneficios.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <button type="button" className="btn btn-cheio btn-grande">{t.hero.iniciar}</button>
          </div>
          <PainelDemo />
        </section>

        <section className="bloco sobre" id="sobre">
          <h2>{t.sobre.titulo}</h2>
          <p>{t.sobre.p1}</p>
          <p>{t.sobre.p2}</p>
        </section>

        <section className="bloco">
          <h2>{t.como.titulo}</h2>
          <div className="grade-etapas">
            {t.como.etapas.map((e) => (
              <article className="card" key={e.titulo}>
                <h3>{e.titulo}</h3>
                <p>{rico(e.texto)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bloco pilares">
          <h2>{t.pilares.titulo}</h2>
          <div className="grade-pilares">
            {t.pilares.itens.map((p) => (
              <article className="card" key={p.titulo}>
                <h3>{p.titulo}</h3>
                <p>{rico(p.texto)}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
