import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { DashboardObjective } from '@biosstel/shared-types';

@Entity('dashboard_objectives')
export class DashboardObjectiveEntity implements DashboardObjective {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  title!: string;

  get name(): string {
    return this.title;
  }
  set name(val: string) {
    this.title = val;
  }

  @Column({ type: 'int', default: 0 })
  achieved!: number;

  @Column({ type: 'int', default: 0 })
  objective!: number;

  @Column({ nullable: true })
  unit?: string;

  @Column({ nullable: true })
  href?: string;

  @Column({ type: 'varchar', default: 'blue' })
  accent!: 'maroon' | 'teal' | 'blue' | 'purple' | 'magenta' | string;

  get color(): string {
    return this.accent;
  }
  set color(val: string) {
    this.accent = val;
  }

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
