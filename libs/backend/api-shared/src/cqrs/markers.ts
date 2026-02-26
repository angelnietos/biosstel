/**
 * CQRS markers: commands (write) and queries (read).
 * Handlers are registered per feature and resolved by the mediator.
 */

export interface ICommand {
  readonly type: string;
}

export interface IQuery {
  readonly type: string;
}

export interface ICommandHandler<TCommand extends ICommand = ICommand, TResult = unknown> {
  handle(command: TCommand): Promise<TResult>;
}

export interface IQueryHandler<TQuery extends IQuery = IQuery, TResult = unknown> {
  handle(query: TQuery): Promise<TResult>;
}

/** Injection token for IMediator (use with @Inject(IMediator)) */
export const IMediator = Symbol('IMediator');
