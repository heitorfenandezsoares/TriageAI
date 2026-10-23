import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bed } from './bed.entity.js';

@Injectable()
export class BedsService implements OnModuleInit {
  constructor(
    @InjectRepository(Bed)
    private bedRepo: Repository<Bed>,
  ) {}

  async onModuleInit() {
    const total = await this.bedRepo.count();
    if (total === 0) {
      const setores: [string, string, number][] = [
        ['enfermaria', 'E', 12],
        ['uti', 'U', 6],
        ['observacao', 'O', 8],
      ];
      const padrao = ['ocupado', 'ocupado', 'disponivel', 'ocupado', 'limpeza', 'ocupado', 'reservado'];
      const leitos = setores.flatMap(([setor, letra, n], s) =>
        Array.from({ length: n }, (_, i) => ({
          id: `${letra}${i + 1}`,
          setor,
          status: padrao[(i + s * 2) % padrao.length],
        })),
      );
      await this.bedRepo.save(leitos);
    }
  }

  async create(createBedDto: Partial<Bed>) {
    const bed = this.bedRepo.create(createBedDto);
    return this.bedRepo.save(bed);
  }

  async findAll() {
    return this.bedRepo.find();
  }

  async findOne(id: string) {
    return this.bedRepo.findOne({ where: { id } });
  }

  async update(id: string, updateBedDto: Partial<Bed>) {
    await this.bedRepo.update(id, updateBedDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.bedRepo.delete(id);
    return { success: true };
  }
}
