/**
 * @biosstel/api-empresa - API Empresa (departamentos, centros de trabajo, cuentas contables)
 * Arquitectura hexagonal: application (ports + use-cases) + infrastructure (api + persistence).
 */
export * from './domain';
export * from './application';
export * from './infrastructure';
export * from './empresa.module';
export * from './infrastructure/api';
