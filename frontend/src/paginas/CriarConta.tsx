import { useState, type FormEvent } from 'react'
import { useIdioma } from '../i18n/idioma'
import LayoutAuth from '../componentes/LayoutAuth'
import ListaRequisitos from '../componentes/ListaRequisitos'
import { Olho, OlhoRiscado } from '../componentes/icones'
import { avaliarSenha, senhaValida } from '../auth/senha'
import { cadastrarPaciente } from '../auth/servicoAuth'

// Cadastro disponível só para pacientes. Profissionais recebem o acesso da instituição.
export default function CriarConta() {
  const { t } = useIdioma()
  const c = t.conta
  const l = t.login
  const [nome, setNome] = useState('')
  const [id, setId] = useState('')
  const [senha, setSenha] = useState('')
  const [conf, setConf] = useState('')
  const [ver, setVer] = useState(false)
  const [aceito, setAceito] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [criado, setCriado] = useState(false)

  const isEmailValido = (email: string) => /\S+@\S+\.\S+/.test(email)

  const req = avaliarSenha(senha, conf)
  const pronto = senhaValida(req) && aceito

  const enviar = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErro(null)

    if (!nome.trim() || !id.trim() || !senha.trim()) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    if (!isEmailValido(id)) {
      setErro('Por favor, informe um endereço de e-mail válido.')
      return
    }

    if (!pronto) return

    setCarregando(true)
    try {
      await cadastrarPaciente({ nome, id, senha })
      setCriado(true)
    } catch (err: any) {
      setErro(err.message && err.message !== 'cadastro' ? err.message : c.erro)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <LayoutAuth modo="paciente" eyebrow={c.eyebrow} titulo={c.titulo} sub={c.sub} aviso={l.paciente.aviso}
      voltar={{ href: '#/login/paciente', texto: c.voltar }}>
      {criado ? (
        <div className="lg-card" role="status">
          <div>
            <h2 className="lg-card-titulo">{c.sucessoTitulo}</h2>
            <p className="lg-card-sub">{c.sucessoTexto}</p>
          </div>
          <a className="lg-entrar" href="#/login/paciente">{c.irLogin}</a>
        </div>
      ) : (
        <form className="lg-card" onSubmit={enviar} noValidate>
          <label className="lg-campo">
            <span className="lg-rotulo">{c.nome}</span>
            <input type="text" name="nome" autoComplete="name" required placeholder={c.nomePh}
              value={nome} onChange={(e) => setNome(e.target.value)} />
          </label>

          <label className="lg-campo">
            <span className="lg-rotulo">{c.campo}</span>
            <input type="email" name="usuario" autoComplete="username" required placeholder={c.ph}
              value={id} onChange={(e) => setId(e.target.value)} />
          </label>

          <div className="lg-campo">
            <label className="lg-rotulo" htmlFor="nova-senha">{c.senha}</label>
            <div className="lg-senha">
              <input id="nova-senha" type={ver ? 'text' : 'password'} name="senha" autoComplete="new-password"
                required placeholder={l.senhaPh} value={senha} onChange={(e) => setSenha(e.target.value)} />
              <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? l.ocultar : l.mostrar} aria-pressed={ver}>
                {ver ? <OlhoRiscado /> : <Olho />}
              </button>
            </div>
          </div>

          <label className="lg-campo">
            <span className="lg-rotulo">{c.confirmar}</span>
            <input type={ver ? 'text' : 'password'} name="confirmacao" autoComplete="new-password" required
              value={conf} onChange={(e) => setConf(e.target.value)} />
          </label>

          <ListaRequisitos req={req} />

          <label className="lg-check">
            <input type="checkbox" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
            <span>{c.termos}</span>
          </label>

          {erro && <p className="lg-erro" role="alert">{erro}</p>}

          <button type="submit" className="lg-entrar" disabled={!pronto || carregando}>
            {carregando ? 'Cadastrando...' : c.criar}
          </button>
          <p className="lg-criar">{c.jaTem} <a className="lg-link" href="#/login/paciente">{c.entrar}</a></p>
        </form>
      )}
    </LayoutAuth>
  )
}
