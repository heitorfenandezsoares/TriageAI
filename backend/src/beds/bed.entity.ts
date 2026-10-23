import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('beds')
export class Bed {
  @PrimaryColumn()
  id: string;

  @Column()
  setor: string; // 'enfermaria' | 'uti' | 'observacao'

  @Column()
  status: string; // 'ocupado' | 'disponivel' | 'limpeza' | 'reservado'
}
