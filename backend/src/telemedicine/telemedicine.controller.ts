import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import type { UsuarioToken } from '../auth/auth.guard.js';
import { PROFISSIONAIS, Roles } from '../auth/roles.decorator.js';
import { TelemedicineService } from './telemedicine.service.js';

@Controller('telemedicine')
export class TelemedicineController {
  constructor(private readonly service: TelemedicineService) {}

  @Roles(...PROFISSIONAIS)
  @Post('rooms')
  createRoom(@Body() body: Record<string, any> | undefined, @Req() req: { user: UsuarioToken }) {
    const pacienteId = typeof body?.pacienteId === 'string' && body.pacienteId.trim() ? body.pacienteId : undefined;
    if (pacienteId && pacienteId.length > 254) throw new BadRequestException('pacienteId inválido.');
    return this.service.createRoom(req.user.email, pacienteId);
  }

  // Qualquer usuário autenticado; a permissão por sala é decidida no serviço.
  @Post('token')
  token(@Body() body: Record<string, any> | undefined, @Req() req: { user: UsuarioToken }) {
    const sala = body?.sala;
    if (typeof sala !== 'string' || !sala || sala.length > 64) throw new BadRequestException('Sala inválida.');
    return this.service.issueToken(sala, req.user);
  }
}
