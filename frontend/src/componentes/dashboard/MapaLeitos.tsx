import type { Leito, SetorLeito, StatusLeito } from '../../dados/tipos'
import { useIdioma } from '../../i18n/idioma'

const SETORES: SetorLeito[] = ['enfermaria', 'uti', 'observacao']
const STATUS: StatusLeito[] = ['ocupado', 'disponivel', 'limpeza', 'reservado']

export default function MapaLeitos({ leitos }: { leitos: Leito[] }) {
  const { t } = useIdioma()
  const d = t.dashboard.leitos

  return (
    <section className="db-bloco" aria-labelledby="h-leitos">
      <h2 id="h-leitos">{d.titulo}</h2>
      {SETORES.map((setor) => {
        const doSetor = leitos.filter((l) => l.setor === setor)
        const ocupados = doSetor.filter((l) => l.status === 'ocupado').length
        return (
          <div key={setor} className="db-setor">
            <h3>{d.setores[setor]} <span>{ocupados}/{doSetor.length} {d.ocupacao}</span></h3>
            <ul className="leitos-grade">
              {doSetor.map((l) => (
                <li key={l.id} className={`leito leito-${l.status}`} aria-label={`${l.id}: ${d.status[l.status]}`} title={d.status[l.status]}>
                  {l.id}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      <ul className="leitos-legenda">
        {STATUS.map((s) => (
          <li key={s}><span className={`leito-amostra leito-${s}`} aria-hidden="true" /> {d.status[s]}</li>
        ))}
      </ul>
    </section>
  )
}
