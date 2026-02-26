/**
 * @biosstel/api-shared - Shared API utilities and modules
 */
export { MetricsModule } from './metrics.module';
export { HttpMetricsInterceptor } from './http-metrics.interceptor';
export { DatabaseConfig } from './config/DatabaseConfig';
export {
  getFeatureAdapter,
  getFeatureServiceUrl,
  getFeatureConnectionString,
  getFullRuntimeConfig,
  getFeaturesConfig,
  getConfig,
  resetFeatureAdapterCache,
  type FeatureKey,
  type AdapterKind,
  type FeatureAdapterConfig,
  type RuntimeConfig,
  type FeatureConfigEntry,
  type GraphQLConfig,
  getGraphQLConfig,
  isGraphQLEnabledForFeature,
} from './adapters';
export {
  EventsModule,
  IEventBus,
  DomainEvents,
  type UserCreatedEvent,
  type UserUpdatedEvent,
  type UserDeletedEvent,
  type UserLoggedInEvent,
  type FichajeStartedEvent,
  type FichajeEndedEvent,
  type FichajePausedEvent,
  type FichajeResumedEvent,
} from './events';
export {
  CqrsModule,
  Mediator,
  IMediator,
  type IMediatorPort,
  type ICommand,
  type IQuery,
  type ICommandHandler,
  type IQueryHandler,
} from './cqrs';
export { paginate, type PaginatedResult } from './utils';
export { FeatureConfigService, ConfigServerModule } from './config-server';