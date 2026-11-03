import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('pre_triagens')
export class PreTriage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  pacienteId: string;

  @Column({ nullable: true })
  pacienteNome: string;

  @Column({ nullable: true })
  idade: string;

  @Column({ nullable: true })
  peso: string;

  @Column({ type: 'text', nullable: true })
  queixa: string;

  @Column({ default: false })
  alerta: boolean;

  @Column({ nullable: true })
  urgencia: string; // 'Baixo' | 'Médio' | 'Alto'

  @Column({ type: 'text', nullable: true })
  redFlags: string;

  @Column({ type: 'text', nullable: true })
  tabelaMarkdown: string;

  @Column({ type: 'text', nullable: true })
  respostas: string;

  @Column({ default: 'pendente' })
  status: string; // 'pendente' | 'em_fila' | 'atendido'

  @CreateDateColumn()
  criadoEm: Date;
}
