/**
 * Entidad ORM para productos (infraestructura).
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  codigo?: string;

  @Column({ type: 'varchar', length: 150, default: '' })
  name!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  familia!: string;

  @Column({ type: 'uuid', nullable: true })
  familyId?: string;

  @Column({ type: 'uuid', nullable: true })
  subfamilyId?: string;

  @Column({ type: 'uuid', nullable: true })
  brandId?: string;

  @Column({ type: 'varchar', length: 50, default: 'Activo' })
  estado!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
