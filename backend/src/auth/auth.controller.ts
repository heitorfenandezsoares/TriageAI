import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    const email = signInDto.id || signInDto.email;
    return this.authService.signIn(email, signInDto.senha);
  }

  @Post('register')
  register(@Body() registerDto: { nome: string; id: string; senha: string }) {
    // Expected to receive { nome: 'João', id: 'joao@example.com', senha: '123' }
    return this.authService.register(registerDto);
  }
}
