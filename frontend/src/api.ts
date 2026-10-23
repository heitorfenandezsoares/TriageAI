const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006';

export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
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
      const dadosErro = await response.json();
      mensagem = dadosErro.message || dadosErro.error || mensagem;
      if (Array.isArray(mensagem)) mensagem = mensagem.join(', ');
    } catch {
      // Ignora erro de parse de JSON caso não venha JSON
    }
    const erro = new Error(mensagem);
    (erro as any).status = response.status;
    throw erro;
  }

  return response.json();
}
