/**
 * Configuración por defecto de persistencia Postgres para Objetivos (Dashboard).
 * Entidades para TypeORM (adaptador por defecto).
 */

import {
  DashboardObjectiveEntity,
  DashboardAlertEntity,
  TerminalObjectiveEntity,
  TerminalAssignmentEntity,
} from '../entities';

/** Entidades TypeORM para TypeOrmModule.forFeature() */
export const OBJETIVOS_POSTGRES_ENTITIES = [
  DashboardObjectiveEntity,
  DashboardAlertEntity,
  TerminalObjectiveEntity,
  TerminalAssignmentEntity,
] as const;
