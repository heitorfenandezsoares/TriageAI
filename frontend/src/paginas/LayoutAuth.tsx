import type { ReactNode } from 'react'
import { useIdioma } from '../i18n/idioma'
import { IDIOMAS, type Idioma, type Modo } from '../i18n/textos'
import { SetaEsq, Escudo } from '../componentes/icones'

interface Props {
  modo: Modo
  eyebrow: string
  titulo: string
  sub: string
  aviso: string
  voltar: { href: string; texto: string }
  children: ReactNode
}

// Estrutura comum das telas de acesso: login, criar conta e recuperar senha.
export default function LayoutAuth({ modo, eyebrow, titulo, sub, aviso, voltar, children }: Props) {
  const { lang, setLang, t } = useIdioma()
  const l = t.login
  const atual = (alvo: Modo): 'page' | undefined => (modo === alvo ? 'page' : undefined)

  return (
    <div className="login">
      <header className="lg-topo">
        <a className="lg-logo" href="#/">TriageAi</a>
        <nav className="lg-abas-topo" aria-label={l.abas}>
          <a className={`btn ${modo === 'paciente' ? 'btn-cheio' : 'btn-contorno'}`} href="#/login/paciente" aria-current={atual('paciente')}>{t.nav.paciente}</a>
          <a className={`btn ${modo === 'profissional' ? 'btn-cheio' : 'btn-contorno'}`} href="#/login/profissional" aria-current={atual('profissional')}>{t.nav.profissional}</a>
        </nav>
      </header>

      <main className="lg-conteudo">
        <div className="lg-intro">
          <a className="lg-voltar" href={voltar.href}><SetaEsq width={16} height={16} /> {voltar.texto}</a>
          <p className="lg-eyebrow">{eyebrow}</p>
          <h1>{titulo}</h1>
          <p className="lg-sub">{sub}</p>
        </div>

        <div className="lg-form-area">
          {children}
        </div>

        <aside className="lg-aviso">
          <Escudo width={22} height={22} />
          <p>{aviso}</p>
        </aside>
      </main>

      <footer className="lg-rodape">
        <select className="seletor-idioma" value={lang} onChange={(e) => setLang(e.target.value as Idioma)} aria-label={t.nav.idioma}>
          {IDIOMAS.map((i) => <option key={i.codigo} value={i.codigo}>{i.rotulo}</option>)}
        </select>
      </footer>
    </div>
  )
}
