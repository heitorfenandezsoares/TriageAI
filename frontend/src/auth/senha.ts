export interface RequisitosSenha {
  tamanho: boolean
  letra: boolean
  numero: boolean
  igual: boolean
}

export function avaliarSenha(senha: string, confirmacao: string): RequisitosSenha {
  return {
    tamanho: senha.length >= 8,
    letra: /[A-Za-zÀ-ÿ]/.test(senha),
    numero: /\d/.test(senha),
    igual: senha.length > 0 && senha === confirmacao,
  }
}

export const senhaValida = (r: RequisitosSenha): boolean => Object.values(r).every(Boolean)
