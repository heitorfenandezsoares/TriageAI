import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import type { UsuarioToken } from '../auth/auth.guard.js';
import { TeleRoom } from './tele-room.entity.js';
import type { SessaoVideo } from './telemedicine.types.js';
export declare class TelemedicineService {
    private repo;
    private config;
    constructor(repo: Repository<TeleRoom>, config: ConfigService);
    createRoom(criadoPor: string, pacienteId?: string): Promise<{
        sala: string;
        expiraEm: Date;
    }>;
    issueToken(sala: string, user: UsuarioToken): Promise<SessaoVideo>;
}
