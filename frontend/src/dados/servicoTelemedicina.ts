import { ErroApi, apiFetch } from '../api'

export interface SessaoVideo {
  provider: 'jaas'
  domain: string
  appId: string
  roomName: string
  jwt: string
}

/** Profissional cria uma sala (opcionalmente ligada a um paciente) e recebe o código dela. */
export function criarSala(pacienteId?: string): Promise<{ sala: string; expiraEm: string }> {
  return apiFetch('/telemedicine/rooms', {
    method: 'POST',
    body: JSON.stringify(pacienteId ? { pacienteId } : {}),
  })
}

/** O backend decide quem entra na sala e devolve o token de acesso. */
export function obterSessaoVideo(sala: string): Promise<SessaoVideo> {
  return apiFetch('/telemedicine/token', { method: 'POST', body: JSON.stringify({ sala }) })
}

export function mensagemErroVideo(e: unknown): string {
  const status = e instanceof ErroApi ? e.status : -1
  if (status === 404) return 'Sala não encontrada ou expirada.'
  if (status === 403) return 'Você não tem acesso a esta sala.'
  if (status === 503) return 'Videoconferência indisponível no momento. Avise a equipe.'
  if (status === 0) return 'Sem conexão com o servidor.'
  return 'Não foi possível entrar na sala.'
}
