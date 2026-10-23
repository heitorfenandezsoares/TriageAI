var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
let AuthService = class AuthService {
    usersService;
    jwtService;
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async signIn(email, pass) {
        const user = await this.usersService.findOne(email);
        if (user && await bcrypt.compare(pass, user.senhaHash)) {
            const payload = { sub: user.id, email: user.email, perfil: user.perfil, nome: user.nome };
            return {
                access_token: await this.jwtService.signAsync(payload),
                usuario: { nome: user.nome, perfil: user.perfil }
            };
        }
        throw new UnauthorizedException('Credenciais inválidas');
    }
    async register(dados) {
        const existing = await this.usersService.findOne(dados.id);
        if (existing) {
            throw new BadRequestException('Usuário já cadastrado com este email/id.');
        }
        const salt = await bcrypt.genSalt();
        const senhaHash = await bcrypt.hash(dados.senha, salt);
        await this.usersService.create({
            email: dados.id,
            senhaHash,
            nome: dados.nome,
            perfil: 'paciente'
        });
        return { message: 'Conta criada com sucesso!' };
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [UsersService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map