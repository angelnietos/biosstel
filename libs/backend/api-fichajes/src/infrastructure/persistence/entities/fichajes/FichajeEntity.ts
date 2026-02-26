import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import type { Fichaje } from '@biosstel/shared-types';
import { UserEntity } from '@biosstel/api-usuarios';

@Entity('fichajes')
export class FichajeEntity implements Fichaje {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column({ type: 'date' })
  date!: string; // YYYY-MM-DD

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({
    type: 'text', // Simple enum stored as string
    default: 'working',
  })
  status!: 'working' | 'paused' | 'finished';

  @Column('jsonb', { default: [] })
  pauses!: { startTime: string; endTime?: string; reason?: string }[];

  @Column('jsonb', { nullable: true })
  location?: { lat: number; lng: number; address?: string };

  @Column({ type: 'int', nullable: true })
  totalTime?: number; // Calculated in code, stored for reporting

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
