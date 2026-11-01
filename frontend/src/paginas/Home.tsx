import { useState } from 'react'
import PainelDemo from '../componentes/PainelDemo'
import ChatbotIA from '../componentes/ChatbotIA'
import { useIdioma, rico } from '../i18n/idioma'
import { IDIOMAS, type Idioma } from '../i18n/textos'

export default function Home() {
  const { lang, setLang, t } = useIdioma()
  const [chatAberto, setChatAberto] = useState(false)

  return (
    <>
      <header className="topo">
        <a className="logo" href="#inicio">TriageAi</a>
        <nav className="menu" aria-label={t.nav.principal}>
          <a href="#sobre">{t.nav.sobre}</a>
          <a href="#como">Como funciona</a>
          <a href="#contato">{t.nav.contato ?? 'Contato'}</a>
          <button
            type="button"
            className="btn-chat-nav"
            onClick={() => setChatAberto(true)}
            aria-label="Abrir assistente virtual com IA"
          >
            <span>💬</span> {t.nav.chat ?? 'Chat IA'}
          </button>
          <select
            className="seletor-idioma"
            value={lang}
            onChange={(e) => setLang(e.target.value as Idioma)}
            aria-label={t.nav.idioma}
          >
            {IDIOMAS.map((i) => (
              <option key={i.codigo} value={i.codigo}>{i.rotulo}</option>
            ))}
          </select>
        </nav>
        <div className="acoes">
          <a className="btn btn-cheio" href="#/login/paciente">{t.nav.paciente}</a>
          <a className="btn btn-contorno" href="#/login/profissional">{t.nav.profissional}</a>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-texto">
            <h1>{t.hero.titulo}</h1>
            <ul className="beneficios">
              {t.hero.beneficios.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
              <button
                type="button"
                className="btn btn-cheio btn-grande"
                onClick={() => setChatAberto(true)}
              >
                💬 Falar com Chatbot IA
              </button>
              <a className="btn btn-contorno btn-grande" href="#/login/paciente">
                {t.hero.iniciar}
              </a>
            </div>
          </div>
          <PainelDemo />
        </section>

        <section className="bloco sobre" id="sobre">
          <h2>{t.sobre.titulo}</h2>
          <p>{t.sobre.p1}</p>
          <p>{t.sobre.p2}</p>
        </section>

        <section className="bloco" id="como">
          <h2>{t.como.titulo}</h2>
          <div className="grade-etapas">
            {t.como.etapas.map((e) => (
              <article className="card" key={e.titulo}>
                <h3>{e.titulo}</h3>
                <p>{rico(e.texto)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bloco pilares" id="pilares">
          <h2>{t.pilares.titulo}</h2>
          <div className="grade-pilares">
            {t.pilares.itens.map((p) => (
              <article className="card" key={p.titulo}>
                <h3>{p.titulo}</h3>
                <p>{rico(p.texto)}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Seção de Contato para orientar visitantes */}
        <section className="bloco contato" id="contato">
          <h2>Contato e Atendimento</h2>
          <p style={{ maxWidth: '680px', marginBottom: '16px', fontSize: '0.9rem' }}>
            Tem dúvidas sobre o TriageAi, deseja agendar uma demonstração ou implementar nossa solução de triagem inteligente em sua instituição de saúde? Fale diretamente com nossa equipe.
          </p>

          <div className="contato-grade">
            <article className="contato-card">
              <h3>📧 E-mail</h3>
              <p>Envie sua mensagem ou dúvida técnica:</p>
              <strong>contato@triageai.com.br</strong>
            </article>

            <article className="contato-card">
              <h3>📞 Telefone & WhatsApp</h3>
              <p>Atendimento direto e suporte:</p>
              <strong>(11) 4002-8922</strong>
            </article>

            <article className="contato-card">
              <h3>🕒 Horário de Atendimento</h3>
              <p>Segunda a Sexta-feira</p>
              <strong>08:00 às 18:00 (Brasília)</strong>
            </article>

            <article className="contato-card">
              <h3>📍 Localização</h3>
              <p>São Paulo - SP</p>
              <strong>Atendimento em todo o Brasil</strong>
            </article>
          </div>

          <div className="contato-cta-box">
            <div>
              <strong style={{ display: 'block', marginBottom: '4px' }}>Deseja tirar dúvidas rápidas agora mesmo?</strong>
              <p>Nosso assistente virtual com IA está online para responder suas dúvidas sobre a empresa e serviços.</p>
            </div>
            <button
              type="button"
              className="btn btn-cheio"
              onClick={() => setChatAberto(true)}
            >
              💬 Iniciar Chat com IA
            </button>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #e7dfd5', padding: '28px 24px', textAlign: 'center', fontSize: '0.82rem', color: '#666', background: 'var(--fundo)' }}>
        <p>© 2026 TriageAi — Classificação de risco inteligente e apoio à decisão clínica. Todos os direitos reservados.</p>
      </footer>

      {/* Componente Chatbot com IA */}
      <ChatbotIA
        abertoControlado={chatAberto}
        onToggleAberto={setChatAberto}
      />
    </>
  )
}
