/**
 * Configuración por defecto de persistencia Postgres para Empresa.
 * Entidades para TypeORM (adaptador por defecto).
 */

import { DepartmentEntity, WorkCenterEntity } from '../entities';

/** Entidades TypeORM para TypeOrmModule.forFeature() */
export const EMPRESA_POSTGRES_ENTITIES = [
  DepartmentEntity,
  WorkCenterEntity,
] as const;
