/**
 * Configuración por defecto de persistencia Postgres para Usuarios.
 * Entidades para TypeORM (adaptador por defecto: postgres).
 */

import { UserEntity, UserDocumentEntity, ClientEntity } from '../entities';

/** Entidades TypeORM para TypeOrmModule.forFeature() */
export const USUARIOS_POSTGRES_ENTITIES = [
  UserEntity,
  UserDocumentEntity,
  ClientEntity,
] as const;
