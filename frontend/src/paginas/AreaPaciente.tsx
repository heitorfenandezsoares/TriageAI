import { useState } from 'react'
import CabecalhoArea from '../componentes/CabecalhoArea'
import { useAuth } from '../auth/AuthContext'
import {
  avancarFila, carregarPaciente, idPaciente, simularEtapa,
  type DadosPaciente, type EtapaAtendimento,
} from '../dados/paciente'
import { useIdioma } from '../i18n/idioma'

const INDICE: Record<EtapaAtendimento, number> = { nenhuma: 0, pre_triagem: 1, chegada: 2, fila: 3 }

export default function AreaPaciente() {
  const { sessao } = useAuth()
  const { lang, t } = useIdioma()
  const id = sessao ? idPaciente(sessao.usuario) : ''
  const [dados, setDados] = useState<DadosPaciente>(() => carregarPaciente(id))
  if (!sessao) return null
  const a = t.areaPaciente
  const atual = INDICE[dados.etapa]
  const data = (ms: number) => new Date(ms).toLocaleString(lang === 'pt' ? 'pt-BR' : lang, { dateStyle: 'short', timeStyle: 'short' })

  return (
    <div className="area">
      <CabecalhoArea />
      <main className="ar-conteudo ap">
        <h1>{t.area.ola}, {sessao.usuario.nome}</h1>

        <section className="db-bloco" aria-labelledby="h-status">
          <h2 id="h-status">{a.statusTitulo}</h2>
          <ol className="ap-etapas">
            {a.etapas.map((rotulo, i) => (
              <li key={rotulo} className={i + 1 < atual ? 'feito' : i + 1 === atual ? 'atual' : undefined}
                aria-current={i + 1 === atual ? 'step' : undefined}>
                <span className="ap-marca" aria-hidden="true">{i + 1 < atual ? '✓' : i + 1}</span>
                {rotulo}
              </li>
            ))}
          </ol>
          <p className="ap-desc">{a.descricoes[dados.etapa]}</p>

          {dados.etapa === 'nenhuma' && <a className="btn btn-cheio" href="#/entrevista">{a.cta}</a>}

          {dados.etapa === 'fila' && (
            <div className="ap-fila" role="status">
              {dados.posicao === 0 ? (
                <p className="ap-posicao">{a.minhaVez}</p>
              ) : (
                <>
                  <p className="ap-posicao">{a.posicao.replace('{n}', String(dados.posicao))}</p>
                  <p>{a.aFrente.replace('{n}', String(dados.posicao - 1))}</p>
                </>
              )}
              <p className="ap-nota">{a.avisoFila}</p>
            </div>
          )}
          <p className="ap-nota">{a.confirmaHospital}</p>
        </section>

        <section className="db-bloco" aria-labelledby="h-hist">
          <h2 id="h-hist">{a.historicoTitulo}</h2>
          {dados.preTriagens.length === 0 ? (
            <p>{a.historicoVazio}</p>
          ) : (
            <ul className="ap-historico">
              {dados.preTriagens.map((p) => (
                <li key={p.id}>
                  <span><strong>{p.queixa}</strong><br /><time dateTime={new Date(p.criadaEm).toISOString()}>{data(p.criadaEm)}</time></span>
                  {p.alerta && <span className="ap-tag-alerta">{a.alertaTag}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="ap-nota">{a.privacidade}</p>

        {import.meta.env.DEV && (
          <section className="db-bloco ap-sim" aria-label="Simulação">
            <h2>Simulação (só em desenvolvimento)</h2>
            <p className="ap-nota">Em produção, a equipe do hospital muda estas etapas.</p>
            <div className="ent-acoes">
              <button type="button" className="btn btn-contorno" onClick={() => setDados(simularEtapa(id, 'chegada'))}>Chegada ao hospital</button>
              <button type="button" className="btn btn-contorno" onClick={() => setDados(simularEtapa(id, 'fila'))}>Triagem feita (entrar na fila)</button>
              <button type="button" className="btn btn-contorno" onClick={() => setDados(avancarFila(id))}>Avançar a fila</button>
              <button type="button" className="btn btn-contorno" onClick={() => setDados(simularEtapa(id, 'pre_triagem'))}>Voltar a "pré-triagem enviada"</button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
