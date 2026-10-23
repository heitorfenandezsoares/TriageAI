import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity.js';
export declare class PatientsService implements OnModuleInit {
    private patientRepo;
    constructor(patientRepo: Repository<Patient>);
    onModuleInit(): Promise<void>;
    create(createPatientDto: Partial<Patient>): Promise<Patient>;
    findAll(): Promise<Patient[]>;
    findOne(id: number): Promise<Patient | null>;
    update(id: number, updatePatientDto: Partial<Patient>): Promise<Patient | null>;
    remove(id: number): Promise<{
        success: boolean;
    }>;
}
