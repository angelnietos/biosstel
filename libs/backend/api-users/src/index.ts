/**
 * @biosstel/api-users - API Users Feature Library
 * 
 * Hexagonal Architecture for NestJS Backend
 * 
 * LAYERS:
 * - application/ports: Input and Output ports (contracts)
 * - application/use-cases: Business logic (use cases)
 * - infrastructure/persistence: Output adapters (TypeORM)
 * - infrastructure/api: Input adapters (Controllers)
 * 
 * PUBLIC EXPORTS:
 * - NestJS Module, Controller, Service
 * - Use Cases (for other modules to use)
 * - Repositories (for advanced use)
 */

export * from './application';
export * from './infrastructure';

// NestJS Module exports
export * from './users.module';
export * from './users.service';
export * from './infrastructure/api/users.controller';
