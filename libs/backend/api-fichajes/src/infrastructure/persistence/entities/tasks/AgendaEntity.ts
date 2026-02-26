import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import type { Agenda } from '@biosstel/shared-types';
import { UserEntity } from '@biosstel/api-usuarios';
import { TaskEntity } from './TaskEntity';

@Entity('agendas')
export class AgendaEntity implements Agenda {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => TaskEntity, (task) => task.agenda)
  tasks?: TaskEntity[];

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy?: string;
}
