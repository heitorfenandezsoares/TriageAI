import { useIdioma } from '../i18n/idioma'
import type { RequisitosSenha } from '../auth/senha'

const ORDEM: (keyof RequisitosSenha)[] = ['tamanho', 'letra', 'numero', 'igual']

export default function ListaRequisitos({ req }: { req: RequisitosSenha }) {
  const { t } = useIdioma()
  return (
    <div className="lg-req">
      <p>{t.conta.requisitos}</p>
      <ul>
        {ORDEM.map((k) => (
          <li key={k} className={req[k] ? 'ok' : undefined}>
            <span aria-hidden="true">{req[k] ? '✓' : '○'}</span> {t.conta.req[k]}
          </li>
        ))}
      </ul>
    </div>
  )
}
