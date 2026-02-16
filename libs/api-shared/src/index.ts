/**
 * @biosstel/api-shared - Shared Library for API
 * 
 * This library provides common utilities and base classes
 * used across all API features following Hexagonal Architecture.
 * 
 * LAYERS:
 * - domain: Value Objects and Entities
 * - application: Base Use Cases and Ports
 * - infrastructure: Common Adapters
 */

// Domain Layer
export * from './domain';

// Application Layer
export * from './application';

// Infrastructure Layer
export * from './infrastructure';
