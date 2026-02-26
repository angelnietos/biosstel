/**
 * @biosstel/api-users - User Document Entity
 * Shared between REST (Postgres) and GraphQL.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../users/UserEntity';

@Entity('user_documents')
export class UserDocumentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType?: string;

  /** Path relativo o nombre de ficheheiro en almacenamiento; o base64 se garda en BD */
  @Column({ type: 'varchar', length: 500, nullable: true })
  filePath?: string;

  /** Contido en base64 para almacenamento simple sen filesystem */
  @Column({ type: 'text', nullable: true })
  contentBase64?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
