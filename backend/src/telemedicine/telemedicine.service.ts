import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import type { UsuarioToken } from '../auth/auth.guard.js';
import { PROFISSIONAIS, type PerfilApi } from '../auth/roles.decorator.js';
import { assinarTokenJaas } from './jaas-token.js';
import { TeleRoom } from './tele-room.entity.js';
import type { SessaoVideo } from './telemedicine.types.js';

const VALIDADE_SALA_HORAS = 24;

@Injectable()
export class TelemedicineService {
  constructor(
    @InjectRepository(TeleRoom) private repo: Repository<TeleRoom>,
    private config: ConfigService,
  ) {}

  async createRoom(criadoPor: string, pacienteId?: string): Promise<{ sala: string; expiraEm: Date }> {
    const sala = randomBytes(16).toString('base64url');
    const expiraEm = new Date(Date.now() + VALIDADE_SALA_HORAS * 3_600_000);
    await this.repo.save({
      id: sala,
      pacienteId: pacienteId?.trim().toLowerCase() || null,
      criadoPor,
      expiraEm,
    } as TeleRoom);
    return { sala, expiraEm };
  }

  async issueToken(sala: string, user: UsuarioToken): Promise<SessaoVideo> {
    const room = await this.repo.findOne({ where: { id: sala } });
    if (!room || room.expiraEm.getTime() <= Date.now()) {
      throw new NotFoundException('Sala não encontrada ou expirada.');
    }

    const perfil = String(user.perfil).toLowerCase().trim() as PerfilApi;
    const ehPaciente = perfil === 'paciente';
    if (ehPaciente && room.pacienteId) {
      const dono = room.pacienteId.toLowerCase();
      if (dono !== user.email.toLowerCase() && dono !== String(user.sub)) {
        throw new ForbiddenException('Você não tem acesso a esta sala.');
      }
    }

    const appId = this.config.get<string>('JAAS_APP_ID');
    const kid = this.config.get<string>('JAAS_KID');
    const privateKey = this.config.get<string>('JAAS_PRIVATE_KEY');
    if (!appId || !kid || !privateKey) {
      throw new ServiceUnavailableException('Videoconferência não configurada no servidor.');
    }

    const jwt = await assinarTokenJaas({ appId, kid, privateKey }, {
      sala: room.id,
      usuario: user,
      moderador: PROFISSIONAIS.includes(perfil), // perfil desconhecido nunca modera
    });
    return { provider: 'jaas', domain: '8x8.vc', appId, roomName: `${appId}/${room.id}`, jwt };
  }
}
