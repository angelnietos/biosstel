/**
 * @biosstel/api-users - Infrastructure Layer: TypeORM User Entity
 *
 * TypeORM entity for database persistence.
 * Shared between REST (Postgres) and GraphQL.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import type { User } from '@biosstel/shared-types';

@Entity('users')
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  [key: string]: unknown;

  @Column({ type: 'varchar', length: 255, unique: true, default: '' })
  email!: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  @Exclude()
  password!: string; // password_hash

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: false })
  emailConfirmed!: boolean;

  @Column({ default: true })
  firstLogin!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  organizationId?: string;

  @Column({ type: 'text', nullable: true })
  role?: string;

  @Column({ type: 'uuid', nullable: true })
  roleId?: string;

  @Column({ type: 'uuid', nullable: true })
  departmentId?: string;

  @Column({ type: 'uuid', nullable: true })
  workCenterId?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
