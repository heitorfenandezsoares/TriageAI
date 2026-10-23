import { useEffect, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import type { Perfil } from '../auth/tipos'
import { useIdioma } from '../i18n/idioma'
import type { Modo } from '../i18n/textos'
import { navegar } from './rota'

interface Props {
  perfis: Perfil[]
  entrada: Modo 
  children: ReactNode
}

export default function RotaProtegida({ perfis, entrada, children }: Props) {
  const { sessao } = useAuth()
  const { t } = useIdioma()

  useEffect(() => {
    if (!sessao) navegar(`/login/${entrada}`)
  }, [sessao, entrada])

  if (!sessao) return null

  if (!perfis.includes(sessao.usuario.perfil)) {
    const minhaArea = sessao.usuario.perfil === 'paciente' ? '#/paciente' : '#/painel'
    return (
      <main className="ar-negado">
        <h1>{t.area.negado.titulo}</h1>
        <p>{t.area.negado.texto}</p>
        <a className="btn btn-cheio" href={minhaArea}>{t.area.negado.voltar}</a>
      </main>
    )
  }

  return <>{children}</>
}
