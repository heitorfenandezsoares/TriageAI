import type { Modo } from '../i18n/textos'
import type { Usuario } from './tipos'
import { apiFetch } from '../api'

export const CODIGO_MOCK = '123456'

export class ErroAuth extends Error {}

export type ResultadoEntrada =
  | { etapa: 'mfa'; usuario: Usuario }
  | { etapa: 'ok'; usuario: Usuario }

export async function entrar(id: string, senha: string, modo: Modo): Promise<ResultadoEntrada> {
  if (!id.trim() || senha.length < 4) throw new ErroAuth('credenciais')
  
  try {
    const data = await apiFetch<{ access_token: string; usuario: Usuario }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id, senha, modo }),
    })

    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token)
    }

    if (modo === 'paciente') {
      return { etapa: 'ok', usuario: data.usuario }
    }
    return { etapa: 'mfa', usuario: data.usuario }
  } catch (err: any) {
    throw new ErroAuth(err.message || 'credenciais')
  }
}

export async function verificarCodigo(codigo: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400))
  if (codigo !== CODIGO_MOCK) throw new ErroAuth('codigo')
}

export interface DadosCadastro { nome: string; id: string; senha: string }

export async function cadastrarPaciente(dados: DadosCadastro): Promise<void> {
  if (!dados.nome.trim() || !dados.id.trim()) throw new ErroAuth('cadastro')

  try {
    await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(dados),
    })
  } catch (err: any) {
    throw new ErroAuth(err.message || 'cadastro')
  }
}

export async function solicitarRecuperacao(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400))
  if (!id.trim()) throw new ErroAuth('recuperacao')
}

export async function redefinirSenha(nova: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400))
  if (nova.length < 8) throw new ErroAuth('senha')
}
