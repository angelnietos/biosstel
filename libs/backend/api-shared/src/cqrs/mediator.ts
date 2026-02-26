/**
 * Mediator facade over @nestjs/cqrs CommandBus and QueryBus.
 * Keeps IMediatorPort (send/execute) so controllers stay unchanged.
 * Handlers are registered via @CommandHandler() / @QueryHandler() and discovered by NestJS.
 */

import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import type { ICommand, IQuery } from './markers';
import type { IMediatorPort } from './mediator.port';

@Injectable()
export class Mediator implements IMediatorPort {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async send<TResult>(command: ICommand): Promise<TResult> {
    return this.commandBus.execute(command) as Promise<TResult>;
  }

  async execute<TResult>(query: IQuery): Promise<TResult> {
    return this.queryBus.query(query) as Promise<TResult>;
  }
}
