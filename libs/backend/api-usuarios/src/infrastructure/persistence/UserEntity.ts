/**
 * @biosstel/api-users - Infrastructure Layer: TypeORM User Entity
 *
 * TypeORM entity for database persistence.
 * This is the infrastructure implementation for the API.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '@biosstel/shared-types';

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  [key: string]: any;

  @Column({ type: 'varchar', length: 255, unique: true, default: '' })
  email!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  @Exclude()
  password!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ type: 'text', nullable: true })
  role?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
