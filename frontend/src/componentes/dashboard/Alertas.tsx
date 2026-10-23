import type { PacienteFila } from '../../dados/tipos'
import { useIdioma } from '../../i18n/idioma'

const LIMIAR = 0.7

export default function Alertas({ fila }: { fila: PacienteFila[] }) {
  const { t } = useIdioma()
  const d = t.dashboard.alertas
  const alertas = fila.filter((p) => p.risco >= LIMIAR).sort((a, b) => b.risco - a.risco)

  return (
    <section className="db-bloco" aria-labelledby="h-alertas">
      <h2 id="h-alertas">{d.titulo}</h2>
      <p className="db-sub">{d.sub}</p>
      <div aria-live="polite">
        {alertas.length === 0 ? (
          <p>{d.vazio}</p>
        ) : (
          <ul className="db-alertas">
            {alertas.map((p) => (
              <li key={p.id} className={`db-pac nivel-${p.nivel}`}>
                <span className="dados">
                  <strong>{p.ini}, {p.idade} {t.painel.anos}</strong>
                  <span>{t.painel.queixas[p.q]}</span>
                </span>
                <span className="db-risco">{Math.round(p.risco * 100)}% {d.risco}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
