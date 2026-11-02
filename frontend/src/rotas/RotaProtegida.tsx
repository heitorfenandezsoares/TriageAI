import { useEffect, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import type { Perfil } from '../auth/tipos'
import { normalizarPerfil } from '../auth/permissoes'
import { useIdioma } from '../i18n/idioma'
import type { Modo } from '../i18n/textos'
import { navegar } from './rota'

interface Props {
  perfis: Perfil[]
  entrada: Modo
  children: ReactNode
}

export default function RotaProtegida({ perfis, entrada, children }: Props) {
  const { sessao, sair } = useAuth()
  const { t } = useIdioma()

  useEffect(() => {
    if (!sessao) navegar(`/login/${entrada}`)
  }, [sessao, entrada])

  if (!sessao) return null

  const perfilNormalizado = normalizarPerfil(sessao.usuario.perfil)

  if (!perfis.includes(perfilNormalizado)) {
    const ehPaciente = perfilNormalizado === 'paciente'
    const minhaArea = ehPaciente ? '#/paciente' : '#/painel'

    return (
      <main className="ar-negado">
        <h1>{t.area.negado.titulo}</h1>
        <p>
          {ehPaciente
            ? `Você está conectado como paciente (${sessao.usuario.nome}), mas esta página é exclusiva para profissionais de saúde.`
            : `Seu perfil atual (${sessao.usuario.perfil}) não possui permissão para acessar esta seção.`}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
          <a className="btn btn-cheio" href={minhaArea}>
            {t.area.negado.voltar}
          </a>
          <button
            type="button"
            className="btn btn-contorno"
            onClick={() => {
              sair()
              navegar(`/login/${entrada}`)
            }}
          >
            {entrada === 'profissional' ? 'Fazer login como Profissional' : 'Fazer login como Paciente'}
          </button>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
