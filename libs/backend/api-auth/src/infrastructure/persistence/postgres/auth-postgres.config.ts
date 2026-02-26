/**
 * Configuración por defecto de persistencia Postgres para Auth.
 * Entidades para TypeORM (adaptador por defecto: postgres).
 */

import { LoginAttemptEntity, RevokedTokenEntity } from '../entities';

/** Entidades TypeORM para TypeOrmModule.forFeature() */
export const AUTH_POSTGRES_ENTITIES = [
  LoginAttemptEntity,
  RevokedTokenEntity,
] as const;
