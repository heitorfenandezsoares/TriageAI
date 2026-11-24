import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Public } from './public.decorator.js';

const texto = (v: unknown): string => (typeof v === 'string' ? v : '');

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    const email = texto(signInDto?.id) || texto(signInDto?.email);
    const senha = texto(signInDto?.senha);
    if (!email || !senha) throw new BadRequestException('Informe e-mail e senha.');
    return this.authService.signIn(email, senha);
  }

  @Post('register')
  register(@Body() registerDto: Record<string, any>) {
    const nome = texto(registerDto?.nome).trim();
    const id = texto(registerDto?.id).trim();
    const senha = texto(registerDto?.senha);
    if (!nome || nome.length > 120) throw new BadRequestException('Nome inválido.');
    if (!id || id.length > 254) throw new BadRequestException('E-mail/id inválido.');
    // Mesmas regras do frontend (auth/senha.ts): 8+ caracteres, ao menos uma letra e um número
    if (senha.length < 8 || senha.length > 72 || !/[A-Za-zÀ-ÿ]/.test(senha) || !/\d/.test(senha)) {
      throw new BadRequestException('A senha precisa ter 8+ caracteres, com letra e número.');
    }
    return this.authService.register({ nome, id, senha });
  }
}
