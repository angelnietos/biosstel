import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * Almacena exportaciones del log de flujo del frontend (solo dev).
 * Una fila = un export (array completo de entradas en payload).
 */
@Entity('frontend_logs')
export class FrontendLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'jsonb', nullable: false })
  payload!: unknown;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  userId!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
