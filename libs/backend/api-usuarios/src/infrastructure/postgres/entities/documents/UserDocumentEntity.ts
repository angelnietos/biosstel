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

  /** Path relativo o nombre de fichero en almacenamiento; o base64 si se guarda en BD */
  @Column({ type: 'varchar', length: 500, nullable: true })
  filePath?: string;

  /** Contenido en base64 para almacenamiento simple sin filesystem */
  @Column({ type: 'text', nullable: true })
  contentBase64?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
