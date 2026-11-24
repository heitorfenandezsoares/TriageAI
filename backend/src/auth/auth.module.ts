import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { randomBytes } from 'node:crypto';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        let secret = config.get<string>('JWT_SECRET');
        if (!secret || secret.length < 32) {
          if (config.get<string>('NODE_ENV') === 'production') {
            throw new Error('JWT_SECRET ausente ou curto demais (mínimo 32 caracteres).');
          }
          Logger.warn(
            'JWT_SECRET não definido (ou curto): usando segredo aleatório temporário. Os logins caem a cada reinício.',
            'AuthModule',
          );
          secret = randomBytes(48).toString('hex');
        }
        return { secret, signOptions: { expiresIn: '1h' } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
