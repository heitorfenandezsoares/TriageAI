import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity.js';
import { PreTriage } from './pre-triage.entity.js';

@Injectable()
export class PatientsService implements OnModuleInit {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
    @InjectRepository(PreTriage)
    private preTriageRepo: Repository<PreTriage>,
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

  // --- FILA DE ATENDIMENTO ---
  async create(createPatientDto: Partial<Patient>) {
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

  async chamarProximo() {
    // Manchester order: vermelho, laranja, amarelo, verde, azul
    const prioridade: Record<string, number> = {
      vermelho: 0,
      laranja: 1,
      amarelo: 2,
      verde: 3,
      azul: 4,
    };

    const todos = await this.patientRepo.find();
    if (todos.length === 0) return null;

    todos.sort((a, b) => {
      const pA = prioridade[a.nivel] ?? 5;
      const pB = prioridade[b.nivel] ?? 5;
      if (pA !== pB) return pA - pB;
      return b.espera - a.espera; // maior tempo de espera primeiro
    });

    const proximo = todos[0];
    return {
      paciente: proximo,
      mensagem: `Atenção: Paciente ${proximo.ini} chamado para a sala de triagem / consultório`,
      chamadoEm: new Date().toISOString(),
    };
  }

  // --- ARMAZENAMENTO DE PRÉ-TRIAGEM ---
  async createPreTriage(dto: Partial<PreTriage>) {
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

  async findPreTriagesByPatient(pacienteId: string) {
    return this.preTriageRepo.find({
      where: [
        { pacienteId },
        { pacienteNome: pacienteId },
      ],
      order: { criadoEm: 'DESC' },
    });
  }

  async admitPreTriage(id: string) {
    const pt = await this.preTriageRepo.findOne({ where: { id } });
    if (!pt) throw new NotFoundException('Pré-triagem não encontrada');

    // Determina iniciais
    const nome = pt.pacienteNome || 'Paciente';
    const partes = nome.trim().split(/\s+/);
    const ini = partes.length > 1
      ? `${partes[0][0]}.${partes[partes.length - 1][0]}.`.toUpperCase()
      : `${nome.slice(0, 2).toUpperCase()}.`;

    // Extrai idade numérica
    const idadeNum = parseInt(pt.idade?.replace(/\D/g, '') || '30', 10) || 30;

    // Determina nível Manchester baseado no risco e urgência
    let nivel = 'verde';
    let risco = 0.15;
    if (pt.alerta || pt.urgencia === 'Alto') {
      nivel = 'laranja';
      risco = 0.85;
    } else if (pt.urgencia === 'Médio') {
      nivel = 'amarelo';
      risco = 0.45;
    }

    // Salva na fila ativa de pacientes
    const patient = await this.patientRepo.save({
      ini,
      idade: idadeNum,
      q: 2, // Índice padrão de queixa clínica
      nivel,
      espera: 0,
      risco,
    });

    // Atualiza status da pré-triagem
    pt.status = 'em_fila';
    await this.preTriageRepo.save(pt);

    return { patient, preTriage: pt };
  }

  async removePreTriage(id: string) {
    await this.preTriageRepo.delete(id);
    return { success: true };
  }

  async removeAllPreTriages() {
    await this.preTriageRepo.clear();
    return { success: true };
  }
}
