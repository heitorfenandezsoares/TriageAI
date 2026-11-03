import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service.js';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // --- FILA DE ATENDIMENTO ---
  @Post()
  create(@Body() createPatientDto: any) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  @Post('chamar-proximo')
  chamarProximo() {
    return this.patientsService.chamarProximo();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: any) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }

  // --- PRÉ-TRIAGENS ---
  @Post('pre-triage')
  createPreTriage(@Body() dto: any) {
    return this.patientsService.createPreTriage(dto);
  }

  @Get('pre-triages/todas')
  findAllPreTriages() {
    return this.patientsService.findAllPreTriages();
  }

  @Get('pre-triage/usuario/:pacienteId')
  findPreTriagesByPatient(@Param('pacienteId') pacienteId: string) {
    return this.patientsService.findPreTriagesByPatient(pacienteId);
  }

  @Post('pre-triage/:id/admit')
  admitPreTriage(@Param('id') id: string) {
    return this.patientsService.admitPreTriage(id);
  }
}
