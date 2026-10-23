import { useEffect, useRef, useState } from 'react'
import { useIdioma } from '../i18n/idioma'
import type { NivelManchester } from '../i18n/textos'

interface Paciente {
  id: number
  ini: string
  idade: number
  q: number // índice da queixa em textos.painel.queixas
  nivel: NivelManchester
}

const ORDEM: Record<NivelManchester, number> = { vermelho: 0, laranja: 1, amarelo: 2, verde: 3, azul: 4 }

const INICIAL: Paciente[] = [
  { id: 1, ini: 'M.S.', idade: 34, q: 0, nivel: 'azul' },
  { id: 2, ini: 'L.F.', idade: 27, q: 1, nivel: 'verde' },
  { id: 3, ini: 'C.R.', idade: 45, q: 2, nivel: 'amarelo' },
  { id: 4, ini: 'J.P.', idade: 61, q: 3, nivel: 'laranja' },
  { id: 5, ini: 'A.T.', idade: 19, q: 4, nivel: 'verde' },
]

const CHEGADAS: Paciente[] = [
  { id: 6, ini: 'R.A.', idade: 58, q: 5, nivel: 'vermelho' },
  { id: 7, ini: 'B.N.', idade: 72, q: 6, nivel: 'amarelo' },
]

const ALTURA = 56
const ESPACO = 8

export default function PainelDemo() {
  const { t } = useIdioma()
  const tp = t.painel
  const [pacientes, setPacientes] = useState<Paciente[]>(INICIAL)
  const [ordenado, setOrdenado] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const reordenarDepois = (ms: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOrdenado(true), ms)
  }

  useEffect(() => {
    reordenarDepois(1600)
    return () => clearTimeout(timer.current)
  }, [])

  const proxima: Paciente | undefined = CHEGADAS[pacientes.length - INICIAL.length]

  const simular = () => {
    if (proxima) {
      setPacientes([...pacientes, proxima])
    } else {
      setPacientes(INICIAL)
    }
    setOrdenado(false)
    reordenarDepois(1200)
  }

  const visual = ordenado
    ? [...pacientes].sort(
        (a, b) => ORDEM[a.nivel] - ORDEM[b.nivel] || a.id - b.id,
      )
    : pacientes
  const posicao = (id: number) => visual.findIndex((p) => p.id === id)

  return (
    <div className="painel">
      <div className="painel-topo">
        <h3>{tp.titulo}</h3>
        <p aria-live="polite">
          {ordenado ? tp.urgencia : tp.chegada}
        </p>
      </div>

      <ul
        className="fila"
        style={{ height: pacientes.length * (ALTURA + ESPACO) - ESPACO }}
      >
        {pacientes.map((p) => (
          <li
            key={p.id}
            className={`paciente nivel-${p.nivel}`}
            style={{
              height: ALTURA,
              transform: `translateY(${posicao(p.id) * (ALTURA + ESPACO)}px)`,
            }}
          >
            <span className="posicao">{posicao(p.id) + 1}º</span>
            <span className="dados">
              <strong>{p.ini}, {p.idade} {tp.anos}</strong>
              <span>{tp.queixas[p.q]}</span>
            </span>
            <span className="selo">{tp.niveis[p.nivel][0]}</span>
          </li>
        ))}
      </ul>

      <button type="button" className="btn btn-contorno btn-pequeno" onClick={simular}>
        {proxima ? tp.simular : tp.reiniciar}
      </button>

      <div className="legenda">
        <h4>{tp.legenda}</h4>
        <ul>
          {Object.entries(tp.niveis).map(([chave, n]) => (
            <li key={chave}>
              <span className={`ponto nivel-${chave}`} aria-hidden="true" />
              <span>
                <strong>{n[0]}</strong> · {n[1]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
