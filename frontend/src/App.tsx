import Home from './paginas/Home'
import Login from './paginas/Login'
import AreaProfissional from './paginas/AreaProfissional'
import AreaPaciente from './paginas/AreaPaciente'
import Triagem from './paginas/Triagem'
import NaoEncontrada from './paginas/NaoEncontrada'
import CriarConta from './paginas/CriarConta'
import RecuperarSenha from './paginas/RecuperarSenha'
import RedefinirSenha from './paginas/RedefinirSenha'
import type { Modo } from './i18n/textos'
import RotaProtegida from './rotas/RotaProtegida'
import { useRota } from './rotas/rota'
import { PERFIS_PROFISSIONAIS, perfisComModulo } from './auth/permissoes'

const modoDe = (rota: string): Modo => (rota.endsWith('profissional') ? 'profissional' : 'paciente')

export default function App() {
  const rota = useRota()

  if (rota.startsWith('/login')) {
    return <Login modo={rota.endsWith('profissional') ? 'profissional' : 'paciente'} />
  }
  if (rota === '/painel') {
    return (
      <RotaProtegida perfis={PERFIS_PROFISSIONAIS} entrada="profissional">
        <AreaProfissional />
      </RotaProtegida>
    )
  }
  if (rota === '/paciente') {
    return (
      <RotaProtegida perfis={['paciente']} entrada="paciente">
        <AreaPaciente />
      </RotaProtegida>
    )
  }
  if (rota === '/criar-conta') return <CriarConta />
  if (rota.startsWith('/recuperar-senha')) return <RecuperarSenha modo={modoDe(rota)} />
  if (rota.startsWith('/redefinir-senha')) return <RedefinirSenha modo={modoDe(rota)} />
  if (rota === '/triagem') {
    return (
      <RotaProtegida perfis={perfisComModulo('triagem')} entrada="profissional">
        <Triagem />
      </RotaProtegida>
    )
  }
  
  if (rota.startsWith('/') && rota !== '/') return <NaoEncontrada />
  return <Home />
}

