import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('dashboard_alerts')
export class DashboardAlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  usuario!: string;

  @Column()
  departamento!: string;

  @Column()
  centroTrabajo!: string;

  @Column({ nullable: true })
  rol?: string;

  @Column()
  estado!: string;

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

