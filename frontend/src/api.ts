<<<<<<< Updated upstream
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006';

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
=======
const API_URL = import.meta.env.VITE_API_URL ?? 'http://' + window.location.hostname + ':3006'
const CHAVE_TOKEN = 'triageai:token'

export class ErroApi extends Error {
  readonly status: number
  constructor(mensagem: string, status: number) {
    super(mensagem)
    this.status = status
  }
}

export function guardarToken(token: string): void {
  try { sessionStorage.setItem(CHAVE_TOKEN, token) } catch {}
}

export function limparToken(): void {
  try { sessionStorage.removeItem(CHAVE_TOKEN) } catch {}
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
  if (token && !headers.has('Authorization')) headers.set('Authorization', 'Bearer ' + token)

  let resposta: Response
  try {
    resposta = await fetch(API_URL + endpoint, { ...options, headers })
  } catch {
    throw new ErroApi('rede', 0)
>>>>>>> Stashed changes
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let mensagem = 'Erro na requisição';
    try {
<<<<<<< Updated upstream
      const dadosErro = await response.json();
      mensagem = dadosErro.message || dadosErro.error || mensagem;
      if (Array.isArray(mensagem)) mensagem = mensagem.join(', ');
    } catch {
      // Ignora erro de parse de JSON caso não venha JSON
    }
    const erro = new Error(mensagem);
    (erro as any).status = response.status;
    throw erro;
=======
      const corpo = (await resposta.json()) as { message?: string | string[] }
      mensagem = Array.isArray(corpo.message) ? corpo.message.join(', ') : (corpo.message ?? mensagem)
    } catch {}
    throw new ErroApi(mensagem, resposta.status)
>>>>>>> Stashed changes
  }

  return response.json();
}
