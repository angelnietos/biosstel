import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { TerminalObjectiveEntity } from './TerminalObjectiveEntity';

@Entity('terminal_assignments')
export class TerminalAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => TerminalObjectiveEntity, (o) => o.assignments, { onDelete: 'CASCADE' })
  terminalObjective!: TerminalObjectiveEntity;

  @Index()
  @Column({ type: 'varchar' })
  groupType!: 'department' | 'person';

  @Index()
  @Column()
  groupTitle!: string;

  @Column()
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

