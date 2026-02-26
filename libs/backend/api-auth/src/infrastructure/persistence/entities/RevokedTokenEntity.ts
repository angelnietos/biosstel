/**
 * @biosstel/api-auth - Infrastructure Layer: TypeORM Revoked Token Entity
 *
 * TypeORM entity for storing revoked refresh tokens (blacklist).
 * Tokens are stored with their expiration date to allow automatic cleanup.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('revoked_tokens')
export class RevokedTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  token!: string; // El token completo (hash o el token mismo)

  @Index()
  @Column({ type: 'timestamp' })
  expiresAt!: Date; // Fecha de expiración del token para limpieza automática

  @CreateDateColumn()
  revokedAt!: Date; // Fecha en que se revocó el token
}
