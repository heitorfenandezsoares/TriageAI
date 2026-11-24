var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { randomBytes } from 'node:crypto';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';
import { UsersModule } from '../users/users.module.js';
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    Module({
        imports: [
            UsersModule,
            JwtModule.registerAsync({
                global: true,
                inject: [ConfigService],
                useFactory: (config) => {
                    let secret = config.get('JWT_SECRET');
                    if (!secret || secret.length < 32) {
                        if (config.get('NODE_ENV') === 'production') {
                            throw new Error('JWT_SECRET ausente ou curto demais (mínimo 32 caracteres).');
                        }
                        Logger.warn('JWT_SECRET não definido (ou curto): usando segredo aleatório temporário. Os logins caem a cada reinício.', 'AuthModule');
                        secret = randomBytes(48).toString('hex');
                    }
                    return { secret, signOptions: { expiresIn: '1h' } };
                },
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
    })
], AuthModule);
export { AuthModule };
//# sourceMappingURL=auth.module.js.map