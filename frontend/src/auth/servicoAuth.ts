import type { Modo } from '../i18n/textos'
import type { Perfil, Usuario } from './tipos'
import { ErroApi, apiFetch } from '../api'

// ATENÇÃO: o código de verificação (MFA) ainda é SIMULADO e fica no front-end — qualquer pessoa
// que leia este arquivo conhece o código. O MFA de verdade precisa ser validado pelo backend
// (TOTP) e o token completo só pode ser emitido depois dele.
export const CODIGO_MOCK = '123456'

export class ErroAuth extends Error {}

export type ResultadoEntrada =
  | { etapa: 'mfa'; usuario: Usuario; token: string }
  | { etapa: 'ok'; usuario: Usuario; token: string }

interface RespostaLogin {
  access_token: string
  usuario: { nome: string; perfil: Perfil }
}

export async function entrar(id: string, senha: string, modo: Modo): Promise<ResultadoEntrada> {
  if (!id.trim() || senha.length < 4) throw new ErroAuth('credenciais')

  let dados: RespostaLogin
  try {
    dados = await apiFetch<RespostaLogin>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ id: id.trim(), senha }),
    })
  } catch (e) {
    throw new ErroAuth(e instanceof ErroApi && e.status === 0 ? 'rede' : 'credenciais')
  }

  // Quem define o perfil é o servidor. A aba escolhida só confere: uma conta de profissional
  // entrando pela aba do paciente (e vice-versa) é recusada — senão daria para pular o MFA.
  const ehPaciente = dados.usuario.perfil === 'paciente'
  if (ehPaciente !== (modo === 'paciente')) throw new ErroAuth('credenciais')

  const usuario: Usuario = { ...dados.usuario, contato: id.trim() }
  return { etapa: ehPaciente ? 'ok' : 'mfa', usuario, token: dados.access_token }
}

export async function verificarCodigo(codigo: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 400))
  if (codigo !== CODIGO_MOCK) throw new ErroAuth('codigo')
}

export interface DadosCadastro { nome: string; id: string; senha: string }

export async function cadastrarPaciente(dados: DadosCadastro): Promise<void> {
  if (!dados.nome.trim() || !dados.id.trim()) throw new ErroAuth('cadastro')
  try {
    await apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(dados) })
  } catch (e) {
    throw new ErroAuth(e instanceof ErroApi && e.status === 0 ? 'rede' : 'cadastro')
  }
}

// ---- Ainda sem endpoint no backend (SIMULADOS) ----
const espera = (ms = 400) => new Promise((r) => setTimeout(r, ms))

// Envia um código de 6 dígitos ao e-mail do paciente. O CPF e o documento NÃO são pedidos aqui:
// a equipe confirma a identidade na triagem presencial.
export async function solicitarCodigo(contato: string): Promise<void> {
  await espera()
  if (!/^\S+@\S+\.\S+$/.test(contato.trim())) throw new ErroAuth('contato')
}

// Responde sempre igual, exista a conta ou não (evita revelar quem tem cadastro).
export async function solicitarRecuperacao(id: string): Promise<void> {
  await espera()
  if (!id.trim()) throw new ErroAuth('recuperacao')
}

export async function redefinirSenha(nova: string): Promise<void> {
  await espera()
  if (nova.length < 8) throw new ErroAuth('senha')
}