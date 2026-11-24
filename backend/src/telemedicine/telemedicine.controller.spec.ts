import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { PROFISSIONAIS, ROLES_KEY } from '../auth/roles.decorator.js';
import { TelemedicineController } from './telemedicine.controller.js';

const req = { user: { sub: 1, email: 'enf@ex.com', perfil: 'enfermeiro', nome: 'Enf' } };
function montar() {
  const service = {
    createRoom: vi.fn(async () => ({ sala: 'abc', expiraEm: new Date() })),
    issueToken: vi.fn(async () => ({ provider: 'jaas' })),
  };
  return { service, controller: new TelemedicineController(service as any) };
}

describe('TelemedicineController', () => {
  it('createRoom delega com req.user.email e pacienteId do body', async () => {
    const { controller, service } = montar();
    await controller.createRoom({ pacienteId: 'maria@ex.com' }, req);
    expect(service.createRoom).toHaveBeenCalledWith('enf@ex.com', 'maria@ex.com');
  });

  it('createRoom sem body usa pacienteId indefinido', async () => {
    const { controller, service } = montar();
    await controller.createRoom(undefined as any, req);
    expect(service.createRoom).toHaveBeenCalledWith('enf@ex.com', undefined);
  });

  it('token delega com sala e req.user', async () => {
    const { controller, service } = montar();
    await controller.token({ sala: 'abc' }, req);
    expect(service.issueToken).toHaveBeenCalledWith('abc', req.user);
  });

  it.each([{}, { sala: 5 }, { sala: '' }, { sala: 'x'.repeat(65) }])(
    'token com sala inválida (%j) lança BadRequestException',
    (body) => {
      const { controller } = montar();
      expect(() => controller.token(body as any, req)).toThrow(BadRequestException);
    },
  );

  it('createRoom exige perfis profissionais e token não tem @Roles', () => {
    expect(Reflect.getMetadata(ROLES_KEY, TelemedicineController.prototype.createRoom)).toEqual(PROFISSIONAIS);
    expect(Reflect.getMetadata(ROLES_KEY, TelemedicineController.prototype.token)).toBeUndefined();
  });
});
