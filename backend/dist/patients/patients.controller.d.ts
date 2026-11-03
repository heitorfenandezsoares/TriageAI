import { PatientsService } from './patients.service.js';
export declare class PatientsController {
    private readonly patientsService;
    constructor(patientsService: PatientsService);
    createPreTriage(dto: any): Promise<import("./pre-triage.entity.js").PreTriage>;
    findAllPreTriages(): Promise<import("./pre-triage.entity.js").PreTriage[]>;
    removeAllPreTriages(): Promise<{
        success: boolean;
    }>;
    findPreTriagesByPatient(pacienteId: string): Promise<import("./pre-triage.entity.js").PreTriage[]>;
    admitPreTriage(id: string): Promise<{
        patient: {
            ini: string;
            idade: number;
            q: number;
            nivel: string;
            espera: number;
            risco: number;
        } & import("./patient.entity.js").Patient;
        preTriage: import("./pre-triage.entity.js").PreTriage;
    }>;
    removePreTriage(id: string): Promise<{
        success: boolean;
    }>;
    create(createPatientDto: any): Promise<import("./patient.entity.js").Patient>;
    findAll(): Promise<import("./patient.entity.js").Patient[]>;
    chamarProximo(): Promise<{
        paciente: import("./patient.entity.js").Patient;
        mensagem: string;
        chamadoEm: string;
    } | null>;
    findOne(id: string): Promise<import("./patient.entity.js").Patient | null>;
    update(id: string, updatePatientDto: any): Promise<import("./patient.entity.js").Patient | null>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
