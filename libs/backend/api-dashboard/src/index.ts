/**
 * @biosstel/api-dashboard - API Dashboard Feature Library
 * 
 * Hexagonal Architecture for NestJS Backend
 * 
 * LAYERS:
 * - application/ports: Input and Output ports (contracts)
 * - application/use-cases: Business logic (use cases)
 * - infrastructure/persistence: Output adapters (TypeORM)
 * - infrastructure/api: Input adapters (Controllers)
 */

export * from './application';
export * from './infrastructure';

export * from './dashboard.module';
export * from './dashboard.service';
export * from './infrastructure/api/dashboard.controller';

