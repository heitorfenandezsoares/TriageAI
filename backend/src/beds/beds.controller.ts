import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BedsService } from './beds.service.js';
import { Roles } from '../auth/roles.decorator.js';

@Controller('beds')
export class BedsController {
  constructor(private readonly bedsService: BedsService) {}

  @Roles('gestor')
  @Post()
  create(@Body() createBedDto: any) {
    return this.bedsService.create(createBedDto);
  }

  @Get()
  findAll() {
    return this.bedsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bedsService.findOne(id);
  }

  @Roles('enfermeiro', 'gestor')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBedDto: any) {
    return this.bedsService.update(id, updateBedDto);
  }

  @Roles('gestor')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bedsService.remove(id);
  }
}
