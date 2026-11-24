var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ForbiddenException, Injectable, NotFoundException, ServiceUnavailableException, } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import { PROFISSIONAIS } from '../auth/roles.decorator.js';
import { assinarTokenJaas } from './jaas-token.js';
import { TeleRoom } from './tele-room.entity.js';
const VALIDADE_SALA_HORAS = 24;
let TelemedicineService = class TelemedicineService {
    repo;
    config;
    constructor(repo, config) {
        this.repo = repo;
        this.config = config;
    }
    async createRoom(criadoPor, pacienteId) {
        const sala = randomBytes(16).toString('base64url');
        const expiraEm = new Date(Date.now() + VALIDADE_SALA_HORAS * 3_600_000);
        await this.repo.save({
            id: sala,
            pacienteId: pacienteId?.trim().toLowerCase() || null,
            criadoPor,
            expiraEm,
        });
        return { sala, expiraEm };
    }
    async issueToken(sala, user) {
        const room = await this.repo.findOne({ where: { id: sala } });
        if (!room || room.expiraEm.getTime() <= Date.now()) {
            throw new NotFoundException('Sala não encontrada ou expirada.');
        }
        const perfil = String(user.perfil).toLowerCase().trim();
        const ehPaciente = perfil === 'paciente';
        if (ehPaciente && room.pacienteId) {
            const dono = room.pacienteId.toLowerCase();
            if (dono !== user.email.toLowerCase() && dono !== String(user.sub)) {
                throw new ForbiddenException('Você não tem acesso a esta sala.');
            }
        }
        const appId = this.config.get('JAAS_APP_ID');
        const kid = this.config.get('JAAS_KID');
        const privateKey = this.config.get('JAAS_PRIVATE_KEY');
        if (!appId || !kid || !privateKey) {
            throw new ServiceUnavailableException('Videoconferência não configurada no servidor.');
        }
        const jwt = await assinarTokenJaas({ appId, kid, privateKey }, {
            sala: room.id,
            usuario: user,
            moderador: PROFISSIONAIS.includes(perfil),
        });
        return { provider: 'jaas', domain: '8x8.vc', appId, roomName: `${appId}/${room.id}`, jwt };
    }
};
TelemedicineService = __decorate([
    Injectable(),
    __param(0, InjectRepository(TeleRoom)),
    __metadata("design:paramtypes", [Repository,
        ConfigService])
], TelemedicineService);
export { TelemedicineService };
//# sourceMappingURL=telemedicine.service.js.map