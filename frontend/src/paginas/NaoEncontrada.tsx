import { useIdioma } from '../i18n/idioma'

export default function NaoEncontrada() {
  const { t } = useIdioma()
  return (
    <main className="ar-negado">
      <h1>{t.naoEncontrada.titulo}</h1>
      <p>{t.naoEncontrada.texto}</p>
      <a className="btn btn-cheio" href="#/">{t.naoEncontrada.voltar}</a>
    </main>
  )
}
