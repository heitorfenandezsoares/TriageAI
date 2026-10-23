import { useEffect, useRef, useState, type FormEvent } from 'react'
import CabecalhoPublico from '../componentes/CabecalhoPublico'
import IdentificacaoPaciente from '../componentes/IdentificacaoPaciente'
import { useAuth } from '../auth/AuthContext'
import { idPaciente, salvarPreTriagem } from '../dados/paciente'
import { PASSOS, ehAlerta, temSinalDeAlerta, type Passo, type Resposta } from '../dados/entrevista' 
import { useIdioma } from '../i18n/idioma'

// Pré-triagem guiada para o paciente. Roteiro fixo, sem IA: não classifica o paciente.
// O paciente se identifica por código (e-mail) e o resumo fica na conta dele; a identidade
// completa (CPF e documento) é confirmada pela equipe na triagem presencial.
// TODO: enviar o resumo ao backend em vez de guardá-lo no navegador (ver dados/paciente.ts).
export default function Entrevista() {
  const { t } = useIdioma()
  const { sessao } = useAuth()
  const e = t.entrevista
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [esperando, setEsperando] = useState(false)
  const [texto, setTexto] = useState('')
  const fimRef = useRef<HTMLDivElement>(null)

  const terminou = respostas.length === PASSOS.length
  const passoAtual: Passo | undefined = PASSOS[respostas.length]

  // Pequena pausa antes da próxima pergunta, como numa conversa
  useEffect(() => {
    if (!esperando) return
    const id = setTimeout(() => setEsperando(false), 500)
    return () => clearTimeout(id)
  }, [esperando])

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [respostas.length, esperando])

  const responder = (valor: string) => {
    if (!passoAtual) return
    const novas = [...respostas, { passo: passoAtual.id, valor }]
    setRespostas(novas)
    setTexto('')
    if (novas.length < PASSOS.length) setEsperando(true)
    else if (sessao?.usuario.perfil === 'paciente') salvarPreTriagem(idPaciente(sessao.usuario), novas)
  }

  const enviarTexto = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    if (texto.trim()) responder(texto.trim())
  }

  const formatar = (passo: Passo, valor: string): string => {
    if (passo.tipo === 'opcoes') return e.inicioOpcoes[Number(valor)]
    if (passo.tipo === 'escala') return `${valor}/10`
    if (passo.tipo === 'simnao') return valor === 'sim' ? e.sim : e.nao
    return valor
  }

  const refazer = () => { setRespostas([]); setEsperando(false); setTexto('') }
  const alerta = temSinalDeAlerta(respostas)
  const mostrarPergunta = !terminou && !esperando && passoAtual

  const identificado = sessao?.usuario.perfil === 'paciente'

  return (
    <>
      <CabecalhoPublico />
      <main className="pub-conteudo ent">
        <a className="ent-voltar" href="#/">← {e.voltar}</a>
        <h1>{e.titulo}</h1>
        <p className="pub-lead">{e.sub}</p>
        <p className="ent-aviso">{e.aviso}</p>

        {!sessao && <IdentificacaoPaciente />}
        {sessao && !identificado && (
          <p className="ent-aviso" role="status">
            {e.profissionalAviso} <a className="saiba-mais" href="#/painel">{e.voltarPainel}</a>
          </p>
        )}
        {identificado && (<>

        <div className="ent-chat" role="log" aria-live="polite" aria-label={e.titulo}>
          <p className="bolha bot">{e.boasVindas}</p>

          {respostas.map((r, i) => {
            const passo = PASSOS[i]
            return (
              <div key={r.passo} className="ent-troca">
                <p className="bolha bot">{e.perguntas[passo.id]}</p>
                <p className="bolha eu">{formatar(passo, r.valor)}</p>
                {ehAlerta(passo, r.valor) && <p className="bolha alerta" role="alert">{e.alerta}</p>}
              </div>
            )
          })}

          {esperando && <p className="bolha bot digitando" aria-label={e.digitando}><span /><span /><span /></p>}
          {mostrarPergunta && (
            <p className="bolha bot">
              <span className="ent-progresso">{e.progresso.replace('{n}', String(respostas.length + 1)).replace('{total}', String(PASSOS.length))}</span>
              {e.perguntas[passoAtual.id]}
            </p>
          )}

          {terminou && (
            <section className="ent-resumo" aria-labelledby="h-resumo">
              <h2 id="h-resumo">{e.resumoTitulo}</h2>
              <p>{e.resumoSub}</p>
              <dl>
                {respostas.map((r, i) => (
                  <div key={r.passo}>
                    <dt>{e.rotulos[r.passo]}</dt>
                    <dd>{formatar(PASSOS[i], r.valor)}</dd>
                  </div>
                ))}
              </dl>
              <p className={alerta ? 'ent-status alerta' : 'ent-status'}>{alerta ? e.comAlerta : e.semAlerta}</p>
              <p>{e.salvo} {e.confirmaHospital}</p>
              <div className="ent-acoes">
                <a className="btn btn-cheio" href="#/paciente">{e.irArea}</a>
                <button type="button" className="btn btn-contorno" onClick={refazer}>{e.recomecar}</button>
              </div>
            </section>
          )}
          <div ref={fimRef} />
        </div>

        {mostrarPergunta && (
          <div className="ent-controles">
            {passoAtual.tipo === 'texto' && (
              <form className="ent-form" onSubmit={enviarTexto}>
                <input type="text" value={texto} maxLength={200} autoFocus required
                  aria-label={e.perguntas[passoAtual.id]} placeholder={e.placeholder}
                  onChange={(ev) => setTexto(ev.target.value)} />
                <button type="submit" className="btn btn-cheio">{e.enviar}</button>
              </form>
            )}
            {passoAtual.tipo === 'opcoes' && (
              <div className="ent-opcoes">
                {e.inicioOpcoes.map((o, i) => (
                  <button key={o} type="button" className="btn btn-contorno" onClick={() => responder(String(i))}>{o}</button>
                ))}
              </div>
            )}
            {passoAtual.tipo === 'escala' && (
              <>
                <p className="ent-escala-rotulo">{e.escalaRotulo}</p>
                <div className="ent-escala">
                  {Array.from({ length: 11 }, (_, n) => (
                    <button key={n} type="button" className="btn btn-contorno" onClick={() => responder(String(n))}>{n}</button>
                  ))}
                </div>
              </>
            )}
            {passoAtual.tipo === 'simnao' && (
              <div className="ent-opcoes">
                <button type="button" className="btn btn-contorno" onClick={() => responder('sim')}>{e.sim}</button>
                <button type="button" className="btn btn-contorno" onClick={() => responder('nao')}>{e.nao}</button>
              </div>
            )}
          </div>
        )}
        </>)}
      </main>
    </>
  )
}
