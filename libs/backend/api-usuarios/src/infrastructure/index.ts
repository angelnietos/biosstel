/**
 * @biosstel/api-usuarios - Infrastructure Layer Exports
 *
 * Organized by data source:
 * - entities: Shared TypeORM entities (used by Postgres and can be used by GraphQL)
 * - postgres: PostgreSQL entities, repositories, REST controllers, persistence mappers
 * - graphql: GraphQL types, resolvers, and presentation mappers
 * - adapters: Alternative adapters (HTTP, MongoDB)
 */

export * from './entities';
export * from './postgres';
export * from './graphql';
export * from './adapters';
