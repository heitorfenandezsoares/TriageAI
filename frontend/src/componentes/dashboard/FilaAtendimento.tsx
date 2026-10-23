import { ALVO_MIN, ORDEM_NIVEL } from '../../dados/manchester'
import type { PacienteFila } from '../../dados/tipos'
import { useIdioma } from '../../i18n/idioma'

export default function FilaAtendimento({ fila }: { fila: PacienteFila[] }) {
  const { t } = useIdioma()
  const d = t.dashboard
  const ordenada = [...fila].sort((a, b) => ORDEM_NIVEL[a.nivel] - ORDEM_NIVEL[b.nivel] || b.espera - a.espera)

  return (
    <section className="db-bloco" aria-labelledby="h-fila">
      <h2 id="h-fila">{d.fila.titulo}</h2>
      {ordenada.length === 0 ? (
        <p>{d.fila.vazio}</p>
      ) : (
        <ol className="db-fila">
          {ordenada.map((p, i) => {
            const excedido = p.espera > ALVO_MIN[p.nivel]
            return (
              <li key={p.id} className={`db-pac nivel-${p.nivel}`}>
                <span className="posicao">{i + 1}º</span>
                <span className="dados">
                  <strong>{p.ini}, {p.idade} {t.painel.anos}</strong>
                  <span>{t.painel.queixas[p.q]}</span>
                </span>
                <span className={`db-espera${excedido ? ' excedido' : ''}`}>
                  {p.espera} {d.min}{excedido && ` · ${d.excedido}`}
                </span>
                <span className="selo">{t.painel.niveis[p.nivel][0]}</span>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
