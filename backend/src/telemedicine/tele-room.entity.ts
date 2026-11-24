import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('tele_rooms')
export class TeleRoom {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id: string;

  /** E-mail (ou id) do paciente dono da sala; null = qualquer paciente logado com o código. */
  @Column({ type: 'varchar', length: 254, nullable: true })
  pacienteId: string | null;

  @Column({ type: 'varchar', length: 254 })
  criadoPor: string;

  @Column({ type: 'datetime' })
  expiraEm: Date;

  @CreateDateColumn({ type: 'datetime', precision: 6 })
  criadoEm: Date;
}
