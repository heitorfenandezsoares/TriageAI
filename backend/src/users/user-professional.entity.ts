import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users_professionals')
export class UserProfessional {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  senhaHash: string;

  @Column()
  nome: string;

  @Column()
  perfil: string; // 'recepcionista' | 'enfermeiro' | 'gestor'
}
