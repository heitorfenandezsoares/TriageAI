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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity.js';
import { PreTriage } from './pre-triage.entity.js';
let PatientsService = class PatientsService {
    patientRepo;
    preTriageRepo;
    constructor(patientRepo, preTriageRepo) {
        this.patientRepo = patientRepo;
        this.preTriageRepo = preTriageRepo;
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
        const patient = this.patientRepo.create({
            espera: 0,
            risco: 0.1,
            ...createPatientDto,
        });
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
    async chamarProximo() {
        const prioridade = {
            vermelho: 0,
            laranja: 1,
            amarelo: 2,
            verde: 3,
            azul: 4,
        };
        const todos = await this.patientRepo.find();
        if (todos.length === 0)
            return null;
        todos.sort((a, b) => {
            const pA = prioridade[a.nivel] ?? 5;
            const pB = prioridade[b.nivel] ?? 5;
            if (pA !== pB)
                return pA - pB;
            return b.espera - a.espera;
        });
        const proximo = todos[0];
        return {
            paciente: proximo,
            mensagem: `Atenção: Paciente ${proximo.ini} chamado para a sala de triagem / consultório`,
            chamadoEm: new Date().toISOString(),
        };
    }
    async createPreTriage(dto) {
        const preTriage = this.preTriageRepo.create({
            ...dto,
            status: dto.status || 'pendente',
        });
        return this.preTriageRepo.save(preTriage);
    }
    async findAllPreTriages() {
        return this.preTriageRepo.find({
            order: { criadoEm: 'DESC' },
        });
    }
    async findPreTriagesByPatient(pacienteId) {
        return this.preTriageRepo.find({
            where: [
                { pacienteId },
                { pacienteNome: pacienteId },
            ],
            order: { criadoEm: 'DESC' },
        });
    }
    async admitPreTriage(id) {
        const pt = await this.preTriageRepo.findOne({ where: { id } });
        if (!pt)
            throw new NotFoundException('Pré-triagem não encontrada');
        const nome = pt.pacienteNome || 'Paciente';
        const partes = nome.trim().split(/\s+/);
        const ini = partes.length > 1
            ? `${partes[0][0]}.${partes[partes.length - 1][0]}.`.toUpperCase()
            : `${nome.slice(0, 2).toUpperCase()}.`;
        const idadeNum = parseInt(pt.idade?.replace(/\D/g, '') || '30', 10) || 30;
        let nivel = 'verde';
        let risco = 0.15;
        if (pt.alerta || pt.urgencia === 'Alto') {
            nivel = 'laranja';
            risco = 0.85;
        }
        else if (pt.urgencia === 'Médio') {
            nivel = 'amarelo';
            risco = 0.45;
        }
        const patient = await this.patientRepo.save({
            ini,
            idade: idadeNum,
            q: 2,
            nivel,
            espera: 0,
            risco,
        });
        pt.status = 'em_fila';
        await this.preTriageRepo.save(pt);
        return { patient, preTriage: pt };
    }
};
PatientsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Patient)),
    __param(1, InjectRepository(PreTriage)),
    __metadata("design:paramtypes", [Repository,
        Repository])
], PatientsService);
export { PatientsService };
//# sourceMappingURL=patients.service.js.map