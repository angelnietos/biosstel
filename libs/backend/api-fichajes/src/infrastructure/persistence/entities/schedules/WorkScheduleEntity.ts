import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('work_schedules')
export class WorkScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  name!: string;

  @Column({ type: 'int', default: 0 })
  hoursPerYear!: number;

  @Column({ type: 'int', default: 0 })
  vacationDays!: number;

  @Column({ type: 'int', default: 0 })
  freeDisposalDays!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursPerDayWeekdays!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursPerDaySaturday!: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursPerWeek!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
