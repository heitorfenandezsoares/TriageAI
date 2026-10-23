import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ini: string; // Iniciais do paciente

  @Column()
  idade: number;

  @Column()
  q: number; // Índice da queixa

  @Column()
  nivel: string; // NivelManchester: 'emergencia' | 'muito_urgente' | 'urgente' | 'pouco_urgente' | 'nao_urgente'

  @Column()
  espera: number; 

  @Column()
  risco: number; 
}
