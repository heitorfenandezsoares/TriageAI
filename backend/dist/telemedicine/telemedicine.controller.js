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
import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import { PROFISSIONAIS, Roles } from '../auth/roles.decorator.js';
import { TelemedicineService } from './telemedicine.service.js';
let TelemedicineController = class TelemedicineController {
    service;
    constructor(service) {
        this.service = service;
    }
    createRoom(body, req) {
        const pacienteId = typeof body?.pacienteId === 'string' && body.pacienteId.trim() ? body.pacienteId : undefined;
        if (pacienteId && pacienteId.length > 254)
            throw new BadRequestException('pacienteId inválido.');
        return this.service.createRoom(req.user.email, pacienteId);
    }
    token(body, req) {
        const sala = body?.sala;
        if (typeof sala !== 'string' || !sala || sala.length > 64)
            throw new BadRequestException('Sala inválida.');
        return this.service.issueToken(sala, req.user);
    }
};
__decorate([
    Roles(...PROFISSIONAIS),
    Post('rooms'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TelemedicineController.prototype, "createRoom", null);
__decorate([
    Post('token'),
    __param(0, Body()),
    __param(1, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TelemedicineController.prototype, "token", null);
TelemedicineController = __decorate([
    Controller('telemedicine'),
    __metadata("design:paramtypes", [TelemedicineService])
], TelemedicineController);
export { TelemedicineController };
//# sourceMappingURL=telemedicine.controller.js.map