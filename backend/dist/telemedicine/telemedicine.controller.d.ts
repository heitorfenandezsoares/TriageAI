import type { UsuarioToken } from '../auth/auth.guard.js';
import { TelemedicineService } from './telemedicine.service.js';
export declare class TelemedicineController {
    private readonly service;
    constructor(service: TelemedicineService);
    createRoom(body: Record<string, any> | undefined, req: {
        user: UsuarioToken;
    }): Promise<{
        sala: string;
        expiraEm: Date;
    }>;
    token(body: Record<string, any> | undefined, req: {
        user: UsuarioToken;
    }): Promise<import("./telemedicine.types.js").SessaoVideo>;
}
