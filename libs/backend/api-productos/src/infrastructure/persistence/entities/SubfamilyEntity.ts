import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { FamilyEntity } from './FamilyEntity';

@Entity('subfamilies')
export class SubfamilyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  familyId!: string;

  @ManyToOne(() => FamilyEntity)
  @JoinColumn({ name: 'familyId' })
  family?: FamilyEntity;

  @Column({ type: 'varchar', length: 100, default: '' })
  name!: string;
}
