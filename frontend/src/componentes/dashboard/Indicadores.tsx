import type { DadosPainel } from '../../dados/tipos'
import { useIdioma } from '../../i18n/idioma'

export default function Indicadores({ fila, leitos }: Pick<DadosPainel, 'fila' | 'leitos'>) {
  const { t } = useIdioma()
  const d = t.dashboard.indicadores
  const media = fila.length ? Math.round(fila.reduce((s, p) => s + p.espera, 0) / fila.length) : 0
  const ocupados = leitos.filter((l) => l.status === 'ocupado').length
  const pct = leitos.length ? Math.round((ocupados / leitos.length) * 100) : 0
  const criticos = fila.filter((p) => p.nivel === 'vermelho' || p.nivel === 'laranja').length

  const itens = [
    { rotulo: d.espera, valor: `${media} ${t.dashboard.min}` },
    { rotulo: d.ocupacao, valor: `${pct}%` },
    { rotulo: d.naFila, valor: String(fila.length) },
    { rotulo: d.criticos, valor: String(criticos) },
  ]

  return (
    <section aria-labelledby="h-ind">
      <h2 id="h-ind" className="db-titulo-secao">{d.titulo}</h2>
      <ul className="db-indicadores">
        {itens.map((i) => (
          <li key={i.rotulo} className="card">
            <span className="db-ind-valor">{i.valor}</span>
            <span className="db-ind-rotulo">{i.rotulo}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
