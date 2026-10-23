import { PatientsService } from './patients.service.js';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    create(createPatientDto: any): Promise<import("./patient.entity.js").Patient>;
    findAll(): Promise<import("./patient.entity.js").Patient[]>;
    findOne(id: string): Promise<import("./patient.entity.js").Patient | null>;
    update(id: string, updatePatientDto: any): Promise<import("./patient.entity.js").Patient | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
