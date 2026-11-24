import { AuthService } from './auth.service.js';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: Record<string, any>): Promise<any>;
    register(registerDto: Record<string, any>): Promise<any>;
}
