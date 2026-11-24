import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import { ROLES_KEY, type PerfilApi } from './roles.decorator.js';

export interface UsuarioToken {
  sub: number;
  email: string;
  perfil: string;
  nome: string;
}

/**
 * Guard global: exige JWT válido em todas as rotas, exceto as marcadas com @Public(),
 * e aplica a restrição de perfis declarada com @Roles().
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const alvos = [context.getHandler(), context.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, alvos)) return true;

    const request = context.switchToHttp().getRequest();
    const [tipo, token] = (request.headers?.authorization ?? '').split(' ');
    if (tipo !== 'Bearer' || !token) throw new UnauthorizedException('Token ausente');

    let payload: UsuarioToken;
    try {
      payload = await this.jwtService.verifyAsync<UsuarioToken>(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    request.user = payload;

    const perfis = this.reflector.getAllAndOverride<PerfilApi[]>(ROLES_KEY, alvos);
    if (perfis?.length) {
      const perfil = String(payload.perfil ?? '').toLowerCase().trim() as PerfilApi;
      if (!perfis.includes(perfil)) throw new ForbiddenException('Perfil sem permissão para esta ação');
    }
    return true;
  }
}
