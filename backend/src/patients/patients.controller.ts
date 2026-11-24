import {
  Controller, Get, Post, Body, Patch, Param, Delete, Req, ForbiddenException,
} from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { Roles, PROFISSIONAIS } from '../auth/roles.decorator.js';
import type { UsuarioToken } from '../auth/auth.guard.js';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // --- PRÉ-TRIAGENS (Rotas específicas antes de parâmetros dinâmicos :id) ---
  @Roles('paciente', ...PROFISSIONAIS)
  @Post('pre-triage')
  createPreTriage(@Body() dto: any) {
    return this.patientsService.createPreTriage(dto);
  }

  @Roles(...PROFISSIONAIS)
  @Get('pre-triages/todas')
  findAllPreTriages() {
    return this.patientsService.findAllPreTriages();
  }

  @Roles('gestor')
  @Delete('pre-triages/todas')
  removeAllPreTriages() {
    return this.patientsService.removeAllPreTriages();
  }

  // Paciente só lê as próprias pré-triagens; profissionais leem de qualquer um.
  @Roles('paciente', ...PROFISSIONAIS)
  @Get('pre-triage/usuario/:pacienteId')
  findPreTriagesByPatient(@Param('pacienteId') pacienteId: string, @Req() req: { user: UsuarioToken }) {
    const { perfil, email, sub } = req.user;
    if (String(perfil).toLowerCase() === 'paciente' && pacienteId !== email && pacienteId !== String(sub)) {
      throw new ForbiddenException('Acesso negado aos dados de outro paciente');
    }
    return this.patientsService.findPreTriagesByPatient(pacienteId);
  }

  @Roles(...PROFISSIONAIS)
  @Post('pre-triage/:id/admit')
  admitPreTriage(@Param('id') id: string) {
    return this.patientsService.admitPreTriage(id);
  }

  @Roles('paciente', ...PROFISSIONAIS)
  @Delete('pre-triage/:id')
  removePreTriage(@Param('id') id: string) {
    return this.patientsService.removePreTriage(id);
  }

  // --- FILA DE ATENDIMENTO ---
  @Roles(...PROFISSIONAIS)
  @Post()
  create(@Body() createPatientDto: any) {
    return this.patientsService.create(createPatientDto);
  }

  // Leitura da fila: qualquer usuário autenticado (a fila só expõe iniciais)
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Roles(...PROFISSIONAIS)
  @Post('chamar-proximo')
  chamarProximo() {
    return this.patientsService.chamarProximo();
  }

  @Roles('enfermeiro', 'gestor')
  @Delete('limpar-fila')
  removeAll() {
    return this.patientsService.removeAll();
  }

  @Roles(...PROFISSIONAIS)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Roles(...PROFISSIONAIS)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: any) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Roles(...PROFISSIONAIS)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
