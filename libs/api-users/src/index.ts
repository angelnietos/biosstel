/**
 * @biosstel/api-users - API Users Feature Library
 * 
 * Hexagonal Architecture for NestJS Backend
 * 
 * LAYERS:
 * - application/ports: Repository interfaces (contracts)
 * - infrastructure/persistence: TypeORM implementations
 * - NestJS Module: users.module.ts, users.service.ts, users.controller.ts
 */

export * from './application';
export * from './infrastructure';

// NestJS Module exports
export * from './users.module';
export * from './users.service';
export * from './users.controller';
