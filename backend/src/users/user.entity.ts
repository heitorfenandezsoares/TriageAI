import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string; // Used as id in login

  @Column()
  senhaHash: string;

  @Column()
  nome: string;

  @Column()
  perfil: string; // 'recepcionista' | 'enfermeiro' | 'gestor' | 'paciente'
}
