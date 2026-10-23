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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity.js';
let PatientsService = class PatientsService {
    patientRepo;
    constructor(patientRepo) {
        this.patientRepo = patientRepo;
    }
    async onModuleInit() {
        const total = await this.patientRepo.count();
        if (total === 0) {
            await this.patientRepo.save([
                { ini: 'M.S.', idade: 34, q: 0, nivel: 'azul', espera: 95, risco: 0.05 },
                { ini: 'L.F.', idade: 27, q: 1, nivel: 'verde', espera: 48, risco: 0.12 },
                { ini: 'C.R.', idade: 45, q: 2, nivel: 'amarelo', espera: 35, risco: 0.45 },
                { ini: 'J.P.', idade: 61, q: 3, nivel: 'laranja', espera: 6, risco: 0.78 },
                { ini: 'A.T.', idade: 19, q: 4, nivel: 'verde', espera: 22, risco: 0.08 },
                { ini: 'B.N.', idade: 72, q: 6, nivel: 'amarelo', espera: 70, risco: 0.72 },
            ]);
        }
    }
    async create(createPatientDto) {
        const patient = this.patientRepo.create(createPatientDto);
        return this.patientRepo.save(patient);
    }
    async findAll() {
        return this.patientRepo.find({
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        return this.patientRepo.findOne({ where: { id } });
    }
    async update(id, updatePatientDto) {
        await this.patientRepo.update(id, updatePatientDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.patientRepo.delete(id);
        return { success: true };
    }
};
PatientsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Patient)),
    __metadata("design:paramtypes", [Repository])
], PatientsService);
export { PatientsService };
//# sourceMappingURL=patients.service.js.map