import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity.js';

@Injectable()
export class PatientsService implements OnModuleInit {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

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

  async create(createPatientDto: Partial<Patient>) {
    const patient = this.patientRepo.create(createPatientDto);
    return this.patientRepo.save(patient);
  }

  async findAll() {
    return this.patientRepo.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    return this.patientRepo.findOne({ where: { id } });
  }

  async update(id: number, updatePatientDto: Partial<Patient>) {
    await this.patientRepo.update(id, updatePatientDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.patientRepo.delete(id);
    return { success: true };
  }
}
