import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TerminalAssignmentEntity } from './TerminalAssignmentEntity';

import type { TerminalObjectivesHeader } from '@biosstel/shared-types';

@Entity('terminal_objectives')
export class TerminalObjectiveEntity implements TerminalObjectivesHeader {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'Objetivos Terminales' })
  title!: string;

  get name(): string {
    return this.title;
  }
  set name(val: string) {
    this.title = val;
  }

  @Column({ type: 'varchar', default: 'blue' })
  color!: string;


  @Column({ default: '' })
  rangeLabel!: string;

  @Column({ type: 'int', default: 0 })
  achieved!: number;

  @Column({ type: 'int', default: 0 })
  objective!: number;

  @Column({ type: 'int', default: 0 })
  pct!: number;

  @Column({ default: true })
  isActive!: boolean;

  /** 'contratos' | 'puntos' — distingue la pestaña en Objetivos Terminales */
  @Column({ type: 'varchar', length: 50, default: 'contratos' })
  objectiveType!: string;

  /** NULL = objetivo actual; 'YYYY-MM' = histórico de ese mes */
  @Column({ type: 'varchar', length: 20, nullable: true })
  period!: string | null;

  @OneToMany(() => TerminalAssignmentEntity, (a) => a.terminalObjective, { cascade: true })
  assignments!: TerminalAssignmentEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
