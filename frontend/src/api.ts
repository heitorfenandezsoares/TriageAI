const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3006'
const CHAVE_TOKEN = 'triageai:token'

// status 0 = não conseguiu falar com o servidor (rede fora do ar, CORS, servidor desligado)
export class ErroApi extends Error {
  readonly status: number
  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.status = status
  }
}

// O token fica no sessionStorage (some ao fechar a aba) e é apagado no logout.
// Solução ideal: o backend enviar o token em cookie httpOnly, que o JavaScript não consegue ler.
export function guardarToken(token: string): void {
  try { sessionStorage.setItem(CHAVE_TOKEN, token) } catch { /* sem armazenamento */ }
}
export function limparToken(): void {
  try { sessionStorage.removeItem(CHAVE_TOKEN) } catch { /* sem armazenamento */ }
}
function lerToken(): string | null {
  try { return sessionStorage.getItem(CHAVE_TOKEN) } catch { return null }
}

export async function apiFetch<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const token = lerToken()
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`)

  let resposta: Response
  try {
    resposta = await fetch(`${API_URL}${endpoint}`, { ...options, headers })
  } catch {
    throw new ErroApi('rede', 0)
  }

  if (!resposta.ok) {
    if (resposta.status === 401) limparToken()
    let mensagem = 'erro'
    try {
      const corpo = (await resposta.json()) as { message?: string | string[] }
      mensagem = Array.isArray(corpo.message) ? corpo.message.join(', ') : (corpo.message ?? mensagem)
    } catch { /* resposta sem JSON */ }
    throw new ErroApi(mensagem, resposta.status)
  }
  return (await resposta.json()) as T
}