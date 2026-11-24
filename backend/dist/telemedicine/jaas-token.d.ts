import type { UsuarioToken } from '../auth/auth.guard.js';
export interface JaasConfig {
    appId: string;
    kid: string;
    privateKey: string;
}
export declare function normalizarChavePrivada(raw: string): string;
export declare function assinarTokenJaas(cfg: JaasConfig, entrada: {
    sala: string;
    usuario: UsuarioToken;
    moderador: boolean;
}): Promise<string>;
