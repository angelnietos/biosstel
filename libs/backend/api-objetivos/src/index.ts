/**
 * @biosstel/api-objetivos - API Objetivos (dashboard, objetivos terminales, asignaciones)
 * Arquitectura hexagonal: application (ports + use-cases) + infrastructure (api + persistence).
 * Nota: el módulo se llama dashboard (dashboard.module / dashboard.service) por el dominio funcional.
 */
export * from './domain';
export * from './application';
export * from './infrastructure';
export * from './dashboard.module';
export * from './dashboard.service';
export * from './infrastructure/api';
