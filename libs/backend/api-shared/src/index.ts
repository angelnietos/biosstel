/**
 * @biosstel/api-shared - Shared API utilities and modules
 */
export { MetricsModule } from './metrics.module';
export { HttpMetricsInterceptor } from './http-metrics.interceptor';
export { DatabaseConfig } from './config/DatabaseConfig';
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