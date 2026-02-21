import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { FichajeTask } from '@biosstel/shared-types';
import { UserEntity } from '@biosstel/api-usuarios';
import { AgendaEntity } from './AgendaEntity';

@Entity('tasks')
export class TaskEntity implements FichajeTask {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column({ name: 'agenda_id', nullable: true })
  agendaId?: string;

  @ManyToOne(() => AgendaEntity, (agenda) => agenda.tasks)
  @JoinColumn({ name: 'agenda_id' })
  agenda?: AgendaEntity;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startTime!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({ default: false })
  completed!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
