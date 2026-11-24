import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
export interface UsuarioToken {
    sub: number;
    email: string;
    perfil: string;
    nome: string;
}
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    constructor(jwtService: JwtService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
