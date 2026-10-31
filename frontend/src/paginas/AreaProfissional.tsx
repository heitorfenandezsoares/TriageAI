import CabecalhoArea from '../componentes/CabecalhoArea'
import FilaAtendimento from '../componentes/dashboard/FilaAtendimento'
import MapaLeitos from '../componentes/dashboard/MapaLeitos'
import Indicadores from '../componentes/dashboard/Indicadores'
import Alertas from '../componentes/dashboard/Alertas'
import { useAuth } from '../auth/AuthContext'
import { MODULOS_POR_PERFIL } from '../auth/permissoes'
import { useDadosTempoReal } from '../dados/useDadosTempoReal'
import { useIdioma } from '../i18n/idioma'

export default function AreaProfissional() {
  const { sessao } = useAuth()
  const { lang, t } = useIdioma()
  const dados = useDadosTempoReal()
  if (!sessao) return null

  const modulos = MODULOS_POR_PERFIL[sessao.usuario.perfil]
  const hora = new Date(dados.atualizadoEm).toLocaleTimeString(lang === 'pt' ? 'pt-BR' : lang)

  return (
    <div className="area">
      <CabecalhoArea />
      <main className="ar-conteudo">
        <div className="db-cabeca">
          <div>
            <h1>{t.area.ola}, {sessao.usuario.nome}</h1>
            <p className="db-atualizado">{t.dashboard.atualizado} {hora}</p>
          </div>
          {modulos.includes('triagem') && (
            <a className="btn btn-cheio" href="#/triagem">{t.dashboard.novaTriagem}</a>
          )}
        </div>

        {modulos.includes('indicadores') && <Indicadores fila={dados.fila} leitos={dados.leitos} />}

        <div className="db-colunas">
          {modulos.includes('fila') && <FilaAtendimento fila={dados.fila} />}
          <div className="db-lateral">
            {modulos.includes('leitos') && <MapaLeitos leitos={dados.leitos} />}
            { }
            {modulos.includes('leitos') && <Alertas fila={dados.fila} />}
          </div>
        </div>
      </main>
    </div>
  )
}
