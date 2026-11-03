import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    // 1. Busca primeiro na tabela dedicada de profissionais (users_professionals)
    const prof = await this.usersService.findOneProfessional(email);
    if (prof && (await bcrypt.compare(pass, prof.senhaHash))) {
      const payload = { sub: prof.id, email: prof.email, perfil: prof.perfil, nome: prof.nome };
      return {
        access_token: await this.jwtService.signAsync(payload),
        usuario: { id: prof.id, email: prof.email, contato: prof.email, nome: prof.nome, perfil: prof.perfil },
      };
    }

    // 2. Se não encontrar, busca na tabela de usuários gerais (pacientes)
    const user = await this.usersService.findOne(email);
    if (user && (await bcrypt.compare(pass, user.senhaHash))) {
      const payload = { sub: user.id, email: user.email, perfil: user.perfil, nome: user.nome };
      return {
        access_token: await this.jwtService.signAsync(payload),
        usuario: { id: user.id, email: user.email, contato: user.email, nome: user.nome, perfil: user.perfil },
      };
    }

    throw new UnauthorizedException('Credenciais inválidas');
  }

  async register(dados: { nome: string; id: string; senha: string }): Promise<any> {
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
      perfil: 'paciente', // Perfil padrão para novos cadastros públicos
    });

    return { message: 'Conta criada com sucesso!' };
  }
}
