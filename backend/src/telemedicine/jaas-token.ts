import { JwtService } from '@nestjs/jwt';
import type { UsuarioToken } from '../auth/auth.guard.js';

export interface JaasConfig {
  appId: string;
  kid: string;
  privateKey: string;
}

/** O .env guarda a chave em uma linha, com "\n" literais no lugar das quebras. */
export function normalizarChavePrivada(raw: string): string {
  return raw.replace(/\\n/g, '\n').trim();
}

// JwtService próprio, sem opções de módulo: o JwtModule global do login tem `secret` (HS256),
// que teria prioridade sobre a chave privada RS256 passada na chamada.
const assinador = new JwtService();

export async function assinarTokenJaas(
  cfg: JaasConfig,
  entrada: { sala: string; usuario: UsuarioToken; moderador: boolean },
): Promise<string> {
  const { sala, usuario, moderador } = entrada;
  return assinador.signAsync(
    {
      room: sala,
      context: {
        user: {
          id: String(usuario.sub),
          name: usuario.nome,
          email: usuario.email,
          moderator: moderador ? 'true' : 'false',
        },
        features: { livestreaming: false, recording: false, transcription: false, 'outbound-call': false },
      },
    },
    {
      algorithm: 'RS256',
      privateKey: normalizarChavePrivada(cfg.privateKey),
      keyid: cfg.kid,
      expiresIn: '2h',
      audience: 'jitsi',
      issuer: 'chat',
      subject: cfg.appId,
    },
  );
}
