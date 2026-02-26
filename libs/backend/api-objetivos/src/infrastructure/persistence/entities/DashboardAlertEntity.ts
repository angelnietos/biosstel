import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { DashboardAlert } from '@biosstel/shared-types';

@Entity('dashboard_alerts')
export class DashboardAlertEntity implements DashboardAlert {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  usuario!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  departamento!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  centroTrabajo!: string;

  @Column({ nullable: true })
  rol?: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  estado!: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  marca?: string;

  @Column({ nullable: true })
  statusType?: 'tienda' | 'telemarketing' | 'comercial' | 'no-fichado' | 'fuera-horario';

  @Column({ type: 'int', default: 0 })
  sortOrder!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
