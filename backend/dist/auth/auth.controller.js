var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Public } from './public.decorator.js';
const texto = (v) => (typeof v === 'string' ? v : '');
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signIn(signInDto) {
        const email = texto(signInDto?.id) || texto(signInDto?.email);
        const senha = texto(signInDto?.senha);
        if (!email || !senha)
            throw new BadRequestException('Informe e-mail e senha.');
        return this.authService.signIn(email, senha);
    }
    register(registerDto) {
        const nome = texto(registerDto?.nome).trim();
        const id = texto(registerDto?.id).trim();
        const senha = texto(registerDto?.senha);
        if (!nome || nome.length > 120)
            throw new BadRequestException('Nome inválido.');
        if (!id || id.length > 254)
            throw new BadRequestException('E-mail/id inválido.');
        if (senha.length < 8 || senha.length > 72 || !/[A-Za-zÀ-ÿ]/.test(senha) || !/\d/.test(senha)) {
            throw new BadRequestException('A senha precisa ter 8+ caracteres, com letra e número.');
        }
        return this.authService.register({ nome, id, senha });
    }
};
__decorate([
    HttpCode(HttpStatus.OK),
    Post('login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "signIn", null);
__decorate([
    Post('register'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
AuthController = __decorate([
    Public(),
    Controller('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map