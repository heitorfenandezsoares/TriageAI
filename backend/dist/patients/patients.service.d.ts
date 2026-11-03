import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity.js';
import { PreTriage } from './pre-triage.entity.js';
export declare class PatientsService implements OnModuleInit {
    private patientRepo;
    private preTriageRepo;
    constructor(patientRepo: Repository<Patient>, preTriageRepo: Repository<PreTriage>);
    onModuleInit(): Promise<void>;
    create(createPatientDto: Partial<Patient>): Promise<Patient>;
    findAll(): Promise<Patient[]>;
    findOne(id: number): Promise<Patient | null>;
    update(id: number, updatePatientDto: Partial<Patient>): Promise<Patient | null>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
    chamarProximo(): Promise<{
        paciente: Patient;
        mensagem: string;
        chamadoEm: string;
    } | null>;
    createPreTriage(dto: Partial<PreTriage>): Promise<PreTriage>;
    findAllPreTriages(): Promise<PreTriage[]>;
    findPreTriagesByPatient(pacienteId: string): Promise<PreTriage[]>;
    admitPreTriage(id: string): Promise<{
        patient: {
            ini: string;
            idade: number;
            q: number;
            nivel: string;
            espera: number;
            risco: number;
        } & Patient;
        preTriage: PreTriage;
    }>;
}
