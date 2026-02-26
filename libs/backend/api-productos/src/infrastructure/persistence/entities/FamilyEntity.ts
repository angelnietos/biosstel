import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('families')
export class FamilyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  name!: string;
}
