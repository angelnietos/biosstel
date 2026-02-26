import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
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

  @Column({ name: 'time_start', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timeStart!: Date;

  get startTime(): Date {
    return this.timeStart;
  }
  set startTime(val: Date) {
    this.timeStart = val;
  }

  @Column({ name: 'time_end', type: 'timestamp', nullable: true })
  timeEnd?: Date;

  get endTime(): Date | undefined {
    return this.timeEnd;
  }
  set endTime(val: Date | undefined) {
    this.timeEnd = val;
  }

  @Column({ default: false })
  completed!: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // No updatedAt in DB schema for tasks. Keeping property to match FichajeTask interface if defined there.
  updatedAt?: Date;
}
