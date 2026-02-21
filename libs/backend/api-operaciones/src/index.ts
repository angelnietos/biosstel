/**
 * @biosstel/api-operaciones - API Operaciones (comercial, telemarketing, tienda, backoffice)
 * Arquitectura hexagonal: application (ports + use-cases) + infrastructure (api + persistence).
 */
export * from './domain';
export * from './application';
export * from './infrastructure';
export * from './operaciones.module';
export * from './operaciones.service';
export * from './infrastructure/api/operaciones.controller';
