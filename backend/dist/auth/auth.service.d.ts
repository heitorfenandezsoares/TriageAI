import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signIn(email: string, pass: string): Promise<any>;
    register(dados: {
        nome: string;
        id: string;
        senha: string;
    }): Promise<any>;
}
