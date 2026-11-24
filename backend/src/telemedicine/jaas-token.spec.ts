import { generateKeyPairSync } from 'node:crypto';
import { JwtService } from '@nestjs/jwt';
import { describe, it, expect } from 'vitest';
import { assinarTokenJaas, normalizarChavePrivada, type JaasConfig } from './jaas-token.js';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const cfg: JaasConfig = { appId: 'vpaas-magic-cookie-test', kid: 'vpaas-magic-cookie-test/abc123', privateKey };
const usuario = { sub: 7, email: 'ana@ex.com', perfil: 'enfermeiro', nome: 'Ana' };
const jwt = new JwtService();
const verificar = (token: string) =>
  jwt.verifyAsync<any>(token, { publicKey, algorithms: ['RS256'] });

describe('assinarTokenJaas', () => {
  it('assina RS256 com kid, aud jitsi, iss chat, sub = appId e room = sala', async () => {
    const token = await assinarTokenJaas(cfg, { sala: 'sala123', usuario, moderador: true });
    const payload = await verificar(token);
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64url').toString());
    expect(header.alg).toBe('RS256');
    expect(header.kid).toBe(cfg.kid);
    expect(payload.aud).toBe('jitsi');
    expect(payload.iss).toBe('chat');
    expect(payload.sub).toBe(cfg.appId);
    expect(payload.room).toBe('sala123');
  });

  it('moderador true gera moderator "true" e false gera "false"', async () => {
    const mod = await verificar(await assinarTokenJaas(cfg, { sala: 's', usuario, moderador: true }));
    const nao = await verificar(await assinarTokenJaas(cfg, { sala: 's', usuario, moderador: false }));
    expect(mod.context.user.moderator).toBe('true');
    expect(nao.context.user.moderator).toBe('false');
    expect(mod.context.user).toMatchObject({ id: '7', name: 'Ana', email: 'ana@ex.com' });
  });

  it('expira em 2h', async () => {
    const p = await verificar(await assinarTokenJaas(cfg, { sala: 's', usuario, moderador: false }));
    expect(p.exp - p.iat).toBe(7200);
  });

  it('aceita chave com \n literais', async () => {
    const escapada = { ...cfg, privateKey: privateKey.replace(/\n/g, '\\n') };
    const token = await assinarTokenJaas(escapada, { sala: 's', usuario, moderador: false });
    expect((await verificar(token)).room).toBe('s');
  });

  it('assina RS256 sem depender do JwtService (HS256) do login', async () => {
    const token = await assinarTokenJaas(cfg, { sala: 's', usuario, moderador: true });
    expect((await verificar(token)).room).toBe('s');
  });

  it('normalizarChavePrivada troca a sequencia literal barra-n por quebra de linha real', () => {
    const literal = 'linha1' + String.fromCharCode(92) + 'nlinha2';
    expect(normalizarChavePrivada(literal)).toBe('linha1' + String.fromCharCode(10) + 'linha2');
  });
});
