import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Sessao, Usuario } from './tipos'

interface ContextoAuth {
  sessao: Sessao | null
  iniciarSessao: (usuario: Usuario) => void
  sair: () => void
}

const Contexto = createContext<ContextoAuth | null>(null)
const CHAVE = 'triageai:sessao'
const DURACAO = 8 * 60 * 60 * 1000 

function carregar(): Sessao | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE)
    if (!bruto) return null
    const s = JSON.parse(bruto) as Sessao
    return s.expiraEm > Date.now() ? s : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Sessao | null>(carregar)

  const iniciarSessao = useCallback((usuario: Usuario) => {
    const nova: Sessao = { usuario, expiraEm: Date.now() + DURACAO }
    setSessao(nova)
    try { sessionStorage.setItem(CHAVE, JSON.stringify(nova)) } catch {  }
  }, [])

  const sair = useCallback(() => {
    setSessao(null)
    try { sessionStorage.removeItem(CHAVE) } catch {  }
  }, [])

  useEffect(() => {
    if (!sessao) return
    const id = setTimeout(sair, Math.max(sessao.expiraEm - Date.now(), 0))
    return () => clearTimeout(id)
  }, [sessao, sair])

  return <Contexto.Provider value={{ sessao, iniciarSessao, sair }}>{children}</Contexto.Provider>
}

export function useAuth(): ContextoAuth {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
