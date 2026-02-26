import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { TerminalObjectiveEntity } from './TerminalObjectiveEntity';

import type { TerminalAssignmentRow } from '@biosstel/shared-types';

@Entity('terminal_assignments')
export class TerminalAssignmentEntity implements TerminalAssignmentRow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => TerminalObjectiveEntity, (o) => o.assignments, { onDelete: 'CASCADE' })
  terminalObjective!: TerminalObjectiveEntity;

  @Index()
  @Column({ type: 'varchar', default: 'department' })
  groupType!: 'department' | 'person';

  @Index()
  @Column({ type: 'varchar', length: 255, default: '' })
  groupTitle!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  label!: string;

  @Column({ type: 'int', default: 0 })
  value!: number;

  @Column({ type: 'int', default: 0 })
  total!: number;

  @Column({ default: true })
  ok!: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
