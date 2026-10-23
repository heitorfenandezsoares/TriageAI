import { useState, type ChangeEvent, type FormEvent } from 'react'
import CabecalhoArea from '../componentes/CabecalhoArea'
import { sugerirClassificacao, type Consciencia, type Sugestao } from '../dados/servicoTriagem'
import { ORDEM_NIVEL } from '../dados/manchester'
import { useIdioma } from '../i18n/idioma'
import type { NivelManchester } from '../i18n/textos'
import { apiFetch } from '../api'

interface Form {
  ident: string; idade: string; queixa: string; fc: string; pas: string; pad: string
  fr: string; spo2: string; temp: string; dor: string; consciencia: string
}
const VAZIO: Form = {
  ident: '', idade: '', queixa: '', fc: '', pas: '', pad: '', fr: '', spo2: '', temp: '', dor: '0', consciencia: 'alerta',
}
const CONSCIENCIAS: Consciencia[] = ['alerta', 'voz', 'dor', 'inconsciente']
const NIVEIS = (Object.keys(ORDEM_NIVEL) as NivelManchester[]).sort((a, b) => ORDEM_NIVEL[a] - ORDEM_NIVEL[b])

export default function Triagem() {
  const { t } = useIdioma()
  const tr = t.triagem
  const [f, setF] = useState<Form>(VAZIO)
  const [sug, setSug] = useState<Sugestao | null>(null)
  const [calculando, setCalculando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [decisao, setDecisao] = useState<'concorda' | 'altera'>('concorda')
  const [nivelFinal, setNivelFinal] = useState<NivelManchester>('azul')
  const [just, setJust] = useState('')
  const [registrado, setRegistrado] = useState<NivelManchester | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const set = (k: keyof Form) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setF({ ...f, [k]: e.target.value })
    setSug(null)
  }

  const num = (k: keyof Form, rotulo: string, min: number, max: number, step = 1) => (
    <label className="tr-campo" key={k}>
      <span className="tr-rotulo">{rotulo}</span>
      <input type="number" inputMode="decimal" min={min} max={max} step={step} required value={f[k]} onChange={set(k)} />
    </label>
  )

  const sugerir = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCalculando(true)
    setErro(null)
    try {
      const s = await sugerirClassificacao({
        fc: +f.fc, pas: +f.pas, pad: +f.pad, fr: +f.fr, spo2: +f.spo2, temp: +f.temp,
        dor: +f.dor, consciencia: f.consciencia as Consciencia,
      })
      setSug(s)
      setNivelFinal(s.nivel)
      setDecisao('concorda')
      setJust('')
    } finally {
      setCalculando(false)
    }
  }

  const registrar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSalvando(true)
    setErro(null)

    const nivelEscolhido = decisao === 'concorda' ? sug!.nivel : nivelFinal

    try {
      // Salva o paciente no banco de dados via API NestJS (/patients)
      await apiFetch('/patients', {
        method: 'POST',
        body: JSON.stringify({
          ini: f.ident.substring(0, 4).toUpperCase(),
          idade: +f.idade,
          q: 0,
          nivel: nivelEscolhido,
          espera: 0,
          risco: (sug?.confianca ? sug.confianca / 100 : 0.5),
        }),
      })

      setRegistrado(nivelEscolhido)
    } catch (err: any) {
      setErro(err.message || 'Falha ao salvar paciente no sistema.')
    } finally {
      setSalvando(false)
    }
  }

  const nova = () => { setF(VAZIO); setSug(null); setRegistrado(null); setErro(null) }

  return (
    <div className="area">
      <CabecalhoArea />
      <main className="ar-conteudo tr-pagina">
        <a className="lg-link tr-voltar" href="#/painel">← {tr.voltar}</a>
        <h1>{tr.titulo}</h1>
        <p className="tr-sub">{tr.sub}</p>

        {registrado ? (
          <div className={`db-bloco tr-ok nivel-${registrado}`} role="status">
            <p>{tr.registrado} <span className="selo">{t.painel.niveis[registrado][0]}</span></p>
            <button type="button" className="btn btn-cheio" onClick={nova}>{tr.nova}</button>
          </div>
        ) : (
          <>
            <form className="db-bloco tr-form" onSubmit={sugerir}>
              <fieldset>
                <legend>{tr.secPaciente}</legend>
                <div className="tr-grade">
                  <label className="tr-campo">
                    <span className="tr-rotulo">{tr.ident}</span>
                    <input type="text" required value={f.ident} onChange={set('ident')} />
                  </label>
                  {num('idade', tr.idade, 0, 120)}
                  <label className="tr-campo tr-largo">
                    <span className="tr-rotulo">{tr.queixa}</span>
                    <input type="text" required value={f.queixa} onChange={set('queixa')} />
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend>{tr.secSinais}</legend>
                <div className="tr-grade">
                  {num('fc', tr.fc, 20, 250)}
                  {num('pas', tr.pas, 40, 300)}
                  {num('pad', tr.pad, 20, 200)}
                  {num('fr', tr.fr, 4, 70)}
                  {num('spo2', tr.spo2, 50, 100)}
                  {num('temp', tr.temp, 30, 45, 0.1)}
                  {num('dor', tr.dor, 0, 10)}
                  <label className="tr-campo">
                    <span className="tr-rotulo">{tr.consciencia}</span>
                    <select value={f.consciencia} onChange={set('consciencia')}>
                      {CONSCIENCIAS.map((c) => <option key={c} value={c}>{tr.consc[c]}</option>)}
                    </select>
                  </label>
                </div>
              </fieldset>

              <button type="submit" className="btn btn-cheio btn-grande" disabled={calculando}>
                {calculando ? tr.calculando : tr.sugerir}
              </button>
            </form>

            <div aria-live="polite">
              {sug && (
                <form className="db-bloco tr-resultado" onSubmit={registrar}>
                  <h2>{tr.resultado}</h2>
                  <div className={`tr-nivel nivel-${sug.nivel}`}>
                    <span className="selo tr-selo-grande">{t.painel.niveis[sug.nivel][0]}</span>
                    <span>{tr.tempoAlvo}: <strong>{t.painel.niveis[sug.nivel][1]}</strong></span>
                    <span>{tr.confianca}: <strong>{sug.confianca}%</strong></span>
                  </div>

                  <h3>{tr.fatores}</h3>
                  {sug.fatores.length === 0 ? (
                    <p>{tr.semFatores}</p>
                  ) : (
                    <ul className="tr-fatores">
                      {sug.fatores.map((ft) => (
                        <li key={ft.id}>
                          <span>{tr.fator[ft.id]}: <strong>{ft.id === 'consciencia' ? tr.consc[ft.valor as Consciencia] : ft.valor}</strong></span>
                          <span className="tr-barra" aria-hidden="true"><span style={{ width: `${Math.round(ft.peso * 100)}%` }} /></span>
                          <span className="tr-peso">+{Math.round(ft.peso * 100)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="tr-aviso">{tr.aviso}</p>
                  {import.meta.env.DEV && <p className="lg-dica">{tr.simulada}</p>}

                  <fieldset>
                    <legend>{tr.decisao}</legend>
                    <label className="tr-radio">
                      <input type="radio" name="decisao" checked={decisao === 'concorda'} onChange={() => setDecisao('concorda')} /> {tr.concordo}
                    </label>
                    <label className="tr-radio">
                      <input type="radio" name="decisao" checked={decisao === 'altera'} onChange={() => setDecisao('altera')} /> {tr.altero}
                    </label>
                    {decisao === 'altera' && (
                      <div className="tr-grade">
                        <label className="tr-campo">
                          <span className="tr-rotulo">{tr.novoNivel}</span>
                          <select value={nivelFinal} onChange={(e) => setNivelFinal(e.target.value as NivelManchester)}>
                            {NIVEIS.map((n) => <option key={n} value={n}>{t.painel.niveis[n][0]}</option>)}
                          </select>
                        </label>
                        <label className="tr-campo tr-largo">
                          <span className="tr-rotulo">{tr.justificativa}</span>
                          <textarea required rows={3} value={just} onChange={(e) => setJust(e.target.value)} />
                        </label>
                      </div>
                    )}
                  </fieldset>

                  {erro && <p className="lg-erro" role="alert">{erro}</p>}

                  <button type="submit" className="btn btn-cheio btn-grande" disabled={salvando}>
                    {salvando ? 'Registrando no Banco...' : tr.registrar}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
