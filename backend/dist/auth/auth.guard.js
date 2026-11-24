var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ForbiddenException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import { ROLES_KEY } from './roles.decorator.js';
let AuthGuard = class AuthGuard {
    jwtService;
    reflector;
    constructor(jwtService, reflector) {
        this.jwtService = jwtService;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const alvos = [context.getHandler(), context.getClass()];
        if (this.reflector.getAllAndOverride(IS_PUBLIC_KEY, alvos))
            return true;
        const request = context.switchToHttp().getRequest();
        const [tipo, token] = (request.headers?.authorization ?? '').split(' ');
        if (tipo !== 'Bearer' || !token)
            throw new UnauthorizedException('Token ausente');
        let payload;
        try {
            payload = await this.jwtService.verifyAsync(token);
        }
        catch {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
        request.user = payload;
        const perfis = this.reflector.getAllAndOverride(ROLES_KEY, alvos);
        if (perfis?.length) {
            const perfil = String(payload.perfil ?? '').toLowerCase().trim();
            if (!perfis.includes(perfil))
                throw new ForbiddenException('Perfil sem permissão para esta ação');
        }
        return true;
    }
};
AuthGuard = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [JwtService,
        Reflector])
], AuthGuard);
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map