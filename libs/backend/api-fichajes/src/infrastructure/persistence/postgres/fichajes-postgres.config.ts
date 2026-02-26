/**
 * Configuración por defecto de persistencia Postgres para Fichajes.
 * postgres/ contiene solo config + implementaciones de repos (fichajes/, tasks/).
 * Las entidades están en persistence/entities (compartidas entre adaptadores).
 */

import type { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  FichajeEntity,
  TaskEntity,
  AgendaEntity,
  WorkCalendarEntity,
  WorkScheduleEntity,
  LeavePermissionTypeEntity,
} from '../entities';
import { PostgresFichajeRepository } from './fichajes';
import { PostgresTaskRepository } from './tasks';
import { IFichajeRepository, ITaskRepository } from '../../../domain/repositories';

/** Entidades TypeORM para TypeOrmModule.forFeature() (entidades en persistence/entities, compartidas) */
export const FICHAJES_POSTGRES_ENTITIES = [
  FichajeEntity,
  TaskEntity,
  AgendaEntity,
  WorkCalendarEntity,
  WorkScheduleEntity,
  LeavePermissionTypeEntity,
] as const;

/** Providers para el módulo cuando el adaptador es postgres */
export function getFichajesPostgresProviders(): Provider[] {
  return [
    {
      provide: getRepositoryToken(WorkCalendarEntity) as string | symbol,
      useFactory: (ds: DataSource) => ds.getRepository(WorkCalendarEntity),
      inject: [DataSource],
    },
    {
      provide: getRepositoryToken(WorkScheduleEntity) as string | symbol,
      useFactory: (ds: DataSource) => ds.getRepository(WorkScheduleEntity),
      inject: [DataSource],
    },
    {
      provide: getRepositoryToken(LeavePermissionTypeEntity) as string | symbol,
      useFactory: (ds: DataSource) => ds.getRepository(LeavePermissionTypeEntity),
      inject: [DataSource],
    },
    { provide: IFichajeRepository, useClass: PostgresFichajeRepository },
    { provide: ITaskRepository, useClass: PostgresTaskRepository },
  ];
}
