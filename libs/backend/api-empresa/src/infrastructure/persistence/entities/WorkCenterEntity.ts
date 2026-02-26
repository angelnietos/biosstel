import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DepartmentEntity } from './DepartmentEntity';

@Entity('work_centers')
export class WorkCenterEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  name!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  address?: string;

  @Column({ type: 'uuid', nullable: true })
  departmentId?: string;

  @ManyToOne(() => DepartmentEntity, { nullable: true })
  @JoinColumn({ name: 'departmentId' })
  department?: DepartmentEntity;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
