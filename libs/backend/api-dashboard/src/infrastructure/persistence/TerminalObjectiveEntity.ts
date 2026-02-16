import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { TerminalAssignmentEntity } from './TerminalAssignmentEntity';

@Entity('terminal_objectives')
export class TerminalObjectiveEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ default: 'Objetivos Terminales' })
  title!: string;

  @Column({ nullable: true })
  rangeLabel?: string;

  @Column({ type: 'int', default: 0 })
  achieved!: number;

  @Column({ type: 'int', default: 0 })
  objective!: number;

  @Column({ type: 'int', default: 0 })
  pct!: number;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => TerminalAssignmentEntity, (a) => a.terminalObjective, { cascade: true })
  assignments!: TerminalAssignmentEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

