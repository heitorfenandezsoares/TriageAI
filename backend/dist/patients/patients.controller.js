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
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service.js';
let PatientsController = class PatientsController {
    patientsService;
    constructor(patientsService) {
        this.patientsService = patientsService;
    }
    createPreTriage(dto) {
        return this.patientsService.createPreTriage(dto);
    }
    findAllPreTriages() {
        return this.patientsService.findAllPreTriages();
    }
    removeAllPreTriages() {
        return this.patientsService.removeAllPreTriages();
    }
    findPreTriagesByPatient(pacienteId) {
        return this.patientsService.findPreTriagesByPatient(pacienteId);
    }
    admitPreTriage(id) {
        return this.patientsService.admitPreTriage(id);
    }
    removePreTriage(id) {
        return this.patientsService.removePreTriage(id);
    }
    create(createPatientDto) {
        return this.patientsService.create(createPatientDto);
    }
    findAll() {
        return this.patientsService.findAll();
    }
    chamarProximo() {
        return this.patientsService.chamarProximo();
    }
    findOne(id) {
        return this.patientsService.findOne(+id);
    }
    update(id, updatePatientDto) {
        return this.patientsService.update(+id, updatePatientDto);
    }
    remove(id) {
        return this.patientsService.remove(+id);
    }
};
__decorate([
    Post('pre-triage'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "createPreTriage", null);
__decorate([
    Get('pre-triages/todas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findAllPreTriages", null);
__decorate([
    Delete('pre-triages/todas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "removeAllPreTriages", null);
__decorate([
    Get('pre-triage/usuario/:pacienteId'),
    __param(0, Param('pacienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findPreTriagesByPatient", null);
__decorate([
    Post('pre-triage/:id/admit'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "admitPreTriage", null);
__decorate([
    Delete('pre-triage/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "removePreTriage", null);
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findAll", null);
__decorate([
    Post('chamar-proximo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "chamarProximo", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatientsController.prototype, "remove", null);
PatientsController = __decorate([
    Controller('patients'),
    __metadata("design:paramtypes", [PatientsService])
], PatientsController);
export { PatientsController };
//# sourceMappingURL=patients.controller.js.map