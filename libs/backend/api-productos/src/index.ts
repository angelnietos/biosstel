/**
 * @biosstel/api-productos - API Productos (productos, inventario, informes)
 * Arquitectura hexagonal: application (ports + use-cases) + infrastructure (api + persistence).
 */
export * from './domain';
export * from './application';
export * from './infrastructure';
export * from './productos.module';
export * from './productos.service';
export * from './infrastructure/api';
