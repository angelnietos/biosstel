/**
 * Mediator implementation: dispatches commands/queries to registered handlers.
 * Handlers are registered by each feature module (OnModuleInit).
 */

import { Injectable, type Type } from '@nestjs/common';
import type { ModuleRef } from '@nestjs/core';
import type { ICommand, IQuery, ICommandHandler, IQueryHandler } from './markers';
import type { IMediatorPort } from './mediator.port';

type CommandCtor = Type<ICommand>;
type QueryCtor = Type<IQuery>;
type CommandHandlerCtor = Type<ICommandHandler<ICommand, unknown>>;
type QueryHandlerCtor = Type<IQueryHandler<IQuery, unknown>>;

@Injectable()
export class Mediator implements IMediatorPort {
  private readonly commandHandlers = new Map<string, CommandHandlerCtor>();
  private readonly queryHandlers = new Map<string, QueryHandlerCtor>();

  constructor(private readonly moduleRef: ModuleRef) {}

  registerCommandHandler(command: CommandCtor, handler: CommandHandlerCtor): void {
    this.commandHandlers.set(command.name, handler);
  }

  registerQueryHandler(query: QueryCtor, handler: QueryHandlerCtor): void {
    this.queryHandlers.set(query.name, handler);
  }

  async send<TResult>(command: ICommand): Promise<TResult> {
    const Handler = this.commandHandlers.get(command.constructor.name);
    if (!Handler) {
      throw new Error(`No handler registered for command: ${command.constructor.name}`);
    }
    const handler = this.moduleRef.get<ICommandHandler<ICommand, TResult>>(Handler, { strict: false });
    return handler.handle(command);
  }

  async execute<TResult>(query: IQuery): Promise<TResult> {
    const Handler = this.queryHandlers.get(query.constructor.name);
    if (!Handler) {
      throw new Error(`No handler registered for query: ${query.constructor.name}`);
    }
    const handler = this.moduleRef.get<IQueryHandler<IQuery, TResult>>(Handler, { strict: false });
    return handler.handle(query);
  }
}
