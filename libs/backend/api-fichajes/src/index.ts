/**
 * @biosstel/api-fichajes - API Fichajes (control jornada, tareas, calendarios, horarios, permisos)
 * Arquitectura hexagonal: application (ports + use-cases) + infrastructure (api + persistence).
 */
export * from './domain';
export * from './application';
export * from './infrastructure';
export * from './fichajes.module';
export * from './fichajes.service';
export * from './infrastructure/api/fichajes.controller';
export * from './infrastructure/api/tasks.controller';
export * from './infrastructure/api/fichajes-calendars.controller';
export * from './infrastructure/api/fichajes-schedules.controller';
export * from './infrastructure/api/fichajes-permissions.controller';
