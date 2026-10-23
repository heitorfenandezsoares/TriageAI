import type { NivelManchester } from '../i18n/textos'

export type Consciencia = 'alerta' | 'voz' | 'dor' | 'inconsciente'
export type FatorId = 'spo2' | 'pa' | 'fc' | 'fr' | 'temp' | 'consciencia' | 'dor'

export interface SinaisVitais {
  fc: number; pas: number; pad: number; fr: number
  spo2: number; temp: number; dor: number; consciencia: Consciencia
}
export interface Fator { id: FatorId; valor: string; peso: number } // peso 0..1: quanto empurra para mais urgência
export interface Sugestao { nivel: NivelManchester; confianca: number; fatores: Fator[] }

// SERVIÇO SIMULADO. Regras simples só para demonstrar a interface.
// Trocar pela chamada ao serviço de ML (XGBoost + SHAP).
export async function sugerirClassificacao(s: SinaisVitais): Promise<Sugestao> {
  await new Promise((r) => setTimeout(r, 500))

  const spo2 = s.spo2 < 85 ? 1 : s.spo2 < 90 ? 0.9 : s.spo2 < 94 ? 0.5 : 0
  const pa = s.pas < 80 ? 1 : s.pas < 90 ? 0.85 : s.pas > 200 ? 0.9 : s.pas > 180 ? 0.6 : 0
  const fc = s.fc > 150 || s.fc < 40 ? 0.9 : s.fc > 120 || s.fc < 50 ? 0.6 : s.fc > 100 ? 0.25 : 0
  const fr = s.fr > 35 || s.fr < 8 ? 0.9 : s.fr > 28 ? 0.6 : s.fr > 22 ? 0.3 : 0
  const temp = s.temp > 40 || s.temp < 35 ? 0.7 : s.temp > 39 ? 0.4 : s.temp >= 38 ? 0.2 : 0
  const consc = { alerta: 0, voz: 0.6, dor: 0.85, inconsciente: 1 }[s.consciencia]
  const dor = s.dor >= 8 ? 0.5 : s.dor >= 5 ? 0.3 : s.dor >= 3 ? 0.1 : 0

  const todos: Fator[] = [
    { id: 'spo2', valor: `${s.spo2}%`, peso: spo2 },
    { id: 'pa', valor: `${s.pas}/${s.pad} mmHg`, peso: pa },
    { id: 'fc', valor: `${s.fc} bpm`, peso: fc },
    { id: 'fr', valor: `${s.fr} irpm`, peso: fr },
    { id: 'temp', valor: `${s.temp} °C`, peso: temp },
    { id: 'consciencia', valor: s.consciencia, peso: consc },
    { id: 'dor', valor: `${s.dor}/10`, peso: dor },
  ]
  const fatores = todos.filter((f) => f.peso > 0).sort((a, b) => b.peso - a.peso).slice(0, 3)

  const max = Math.max(...todos.map((f) => f.peso))
  const soma = todos.reduce((acc, f) => acc + f.peso, 0)
  const nivel: NivelManchester =
    max >= 0.9 ? 'vermelho' : max >= 0.6 || soma >= 1.2 ? 'laranja'
    : max >= 0.3 || soma >= 0.6 ? 'amarelo' : soma > 0.1 ? 'verde' : 'azul'

  return { nivel, confianca: Math.round((0.7 + 0.25 * max) * 100), fatores }
}
