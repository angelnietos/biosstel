import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('brands')
export class BrandEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  name!: string;
}
