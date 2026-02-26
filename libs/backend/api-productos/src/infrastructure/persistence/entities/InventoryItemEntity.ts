import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { InventoryItem } from '@biosstel/shared-types';

@Entity('inventory_items')
export class InventoryItemEntity implements InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100, default: '' })
  codigo!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  nombre!: string;

  @Column({ type: 'int', default: 0 })
  cantidad!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ubicacion?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
