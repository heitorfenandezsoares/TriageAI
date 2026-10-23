import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { IDIOMAS, textos, type Idioma, type Textos } from './textos'

interface ContextoIdioma {
  lang: Idioma
  setLang: (lang: Idioma) => void
  t: Textos
}

const Contexto = createContext<ContextoIdioma | null>(null)
const CHAVE = 'triageai:idioma'

const ehIdioma = (valor: unknown): valor is Idioma =>
  IDIOMAS.some((i) => i.codigo === valor)

function idiomaInicial(): Idioma {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (ehIdioma(salvo)) return salvo
  } catch { }
  const nav = (navigator.language || 'pt').slice(0, 2)
  return ehIdioma(nav) ? nav : 'pt'
}

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Idioma>(idiomaInicial)
  const t = textos[lang]

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang
    document.title = t.titulo
    try { localStorage.setItem(CHAVE, lang) } catch { }
  }, [lang, t])

  return <Contexto.Provider value={{ lang, setLang, t }}>{children}</Contexto.Provider>
}

export function useIdioma(): ContextoIdioma {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useIdioma deve ser usado dentro de <IdiomaProvider>')
  return ctx
}

export function rico(texto: string): ReactNode[] {
  return texto.split('**').map((parte, i) =>
    i % 2 ? <strong key={i}>{parte}</strong> : parte,
  )
}
