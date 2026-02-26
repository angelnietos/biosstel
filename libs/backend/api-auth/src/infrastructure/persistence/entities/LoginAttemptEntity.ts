/**
 * @biosstel/api-auth - Infrastructure Layer: TypeORM Login Attempt Entity
 *
 * TypeORM entity for logging login attempts for security auditing.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('login_attempts')
export class LoginAttemptEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  userId!: string; // Puede ser el ID del usuario o el email si el usuario no existe

  @Column({ type: 'boolean' })
  success!: boolean;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip?: string; // IPv4 o IPv6

  @CreateDateColumn()
  createdAt!: Date;
}
