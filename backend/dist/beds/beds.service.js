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
import { Bed } from './bed.entity.js';
let BedsService = class BedsService {
    bedRepo;
    constructor(bedRepo) {
        this.bedRepo = bedRepo;
    }
    async onModuleInit() {
        const total = await this.bedRepo.count();
        if (total === 0) {
            const setores = [
                ['enfermaria', 'E', 12],
                ['uti', 'U', 6],
                ['observacao', 'O', 8],
            ];
            const padrao = ['ocupado', 'ocupado', 'disponivel', 'ocupado', 'limpeza', 'ocupado', 'reservado'];
            const leitos = setores.flatMap(([setor, letra, n], s) => Array.from({ length: n }, (_, i) => ({
                id: `${letra}${i + 1}`,
                setor,
                status: padrao[(i + s * 2) % padrao.length],
            })));
            await this.bedRepo.save(leitos);
        }
    }
    async create(createBedDto) {
        const bed = this.bedRepo.create(createBedDto);
        return this.bedRepo.save(bed);
    }
    async findAll() {
        return this.bedRepo.find();
    }
    async findOne(id) {
        return this.bedRepo.findOne({ where: { id } });
    }
    async update(id, updateBedDto) {
        await this.bedRepo.update(id, updateBedDto);
        return this.findOne(id);
    }
    async remove(id) {
        await this.bedRepo.delete(id);
        return { success: true };
    }
};
BedsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Bed)),
    __metadata("design:paramtypes", [Repository])
], BedsService);
export { BedsService };
//# sourceMappingURL=beds.service.js.map