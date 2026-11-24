import { generateKeyPairSync } from 'node:crypto';
import { ForbiddenException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TelemedicineService } from './telemedicine.service.js';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const envCompleto: Record<string, string> = {
  JAAS_APP_ID: 'vpaas-magic-cookie-test',
  JAAS_KID: 'vpaas-magic-cookie-test/k1',
  JAAS_PRIVATE_KEY: privateKey,
};

const profissional = { sub: 1, email: 'enf@ex.com', perfil: 'enfermeiro', nome: 'Enf' };
const paciente = { sub: 9, email: 'Maria@Ex.com', perfil: 'paciente', nome: 'Maria' };
const outroPaciente = { sub: 10, email: 'joao@ex.com', perfil: 'paciente', nome: 'João' };
const jwt = new JwtService();

function montar(env: Record<string, string> = envCompleto) {
  const repo = { save: vi.fn(async (x: any) => x), findOne: vi.fn() };
  const config = { get: (k: string) => env[k] };
  return { repo, service: new TelemedicineService(repo as any, config as any) };
}
const sala = (extra: object = {}) => ({
  id: 'abc', pacienteId: null, criadoPor: 'enf@ex.com',
  expiraEm: new Date(Date.now() + 3_600_000), ...extra,
});
const decodificar = (t: string) => jwt.verifyAsync<any>(t, { publicKey, algorithms: ['RS256'] });

describe('TelemedicineService.createRoom', () => {
  it('gera id aleatório base64url com 22+ caracteres, expira em ~24h e ids diferem', async () => {
    const { service } = montar();
    const a = await service.createRoom('enf@ex.com');
    const b = await service.createRoom('enf@ex.com');
    expect(a.sala).toMatch(/^[A-Za-z0-9_-]{22,}$/);
    expect(a.sala).not.toBe(b.sala);
    const horas = (a.expiraEm.getTime() - Date.now()) / 3_600_000;
    expect(horas).toBeGreaterThan(23.9);
    expect(horas).toBeLessThanOrEqual(24);
  });

  it('normaliza pacienteId (trim + minúsculas) e salva null quando ausente', async () => {
    const { service, repo } = montar();
    await service.createRoom('enf@ex.com', '  Maria@Ex.com ');
    await service.createRoom('enf@ex.com');
    expect(repo.save.mock.calls[0][0].pacienteId).toBe('maria@ex.com');
    expect(repo.save.mock.calls[1][0].pacienteId).toBeNull();
    expect(repo.save.mock.calls[0][0].criadoPor).toBe('enf@ex.com');
  });
});

describe('TelemedicineService.issueToken', () => {
  let ctx: ReturnType<typeof montar>;
  beforeEach(() => { ctx = montar(); });

  it('profissional recebe sessão jaas com moderator true', async () => {
    ctx.repo.findOne.mockResolvedValue(sala());
    const s = await ctx.service.issueToken('abc', profissional);
    expect(s).toMatchObject({ provider: 'jaas', domain: '8x8.vc', appId: 'vpaas-magic-cookie-test', roomName: 'vpaas-magic-cookie-test/abc' });
    const p = await decodificar(s.jwt);
    expect(p.context.user.moderator).toBe('true');
    expect(p.room).toBe('abc');
  });

  it.each(['', 'desconhecido', 'admin'])('perfil %j (fora dos profissionais) entra sem moderação', async (perfil) => {
    ctx.repo.findOne.mockResolvedValue(sala());
    const s = await ctx.service.issueToken('abc', { ...profissional, perfil });
    expect((await decodificar(s.jwt)).context.user.moderator).toBe('false');
  });

  it('paciente em sala sem pacienteId entra como não moderador', async () => {
    ctx.repo.findOne.mockResolvedValue(sala());
    const s = await ctx.service.issueToken('abc', paciente);
    expect((await decodificar(s.jwt)).context.user.moderator).toBe('false');
  });

  it('paciente dono da sala entra mesmo com e-mail em caixa diferente', async () => {
    ctx.repo.findOne.mockResolvedValue(sala({ pacienteId: 'maria@ex.com' }));
    await expect(ctx.service.issueToken('abc', paciente)).resolves.toMatchObject({ provider: 'jaas' });
  });

  it('outro paciente é barrado com ForbiddenException', async () => {
    ctx.repo.findOne.mockResolvedValue(sala({ pacienteId: 'maria@ex.com' }));
    await expect(ctx.service.issueToken('abc', outroPaciente)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('sala inexistente ou expirada lança NotFoundException', async () => {
    ctx.repo.findOne.mockResolvedValueOnce(null);
    await expect(ctx.service.issueToken('x', profissional)).rejects.toBeInstanceOf(NotFoundException);
    ctx.repo.findOne.mockResolvedValueOnce(sala({ expiraEm: new Date(Date.now() - 1000) }));
    await expect(ctx.service.issueToken('abc', profissional)).rejects.toBeInstanceOf(NotFoundException);
  });

  it.each(['JAAS_APP_ID', 'JAAS_KID', 'JAAS_PRIVATE_KEY'])(
    'lança ServiceUnavailableException quando %s falta',
    async (faltando) => {
      const env = { ...envCompleto };
      delete env[faltando];
      const { service, repo } = montar(env);
      repo.findOne.mockResolvedValue(sala());
      await expect(service.issueToken('abc', profissional)).rejects.toBeInstanceOf(ServiceUnavailableException);
    },
  );
});
