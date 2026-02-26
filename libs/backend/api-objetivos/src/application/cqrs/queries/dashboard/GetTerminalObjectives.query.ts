import type { IQuery } from '@biosstel/api-shared';

export class GetTerminalObjectivesQuery implements IQuery {
  readonly type = 'GetTerminalObjectivesQuery';
  constructor(public readonly filters?: Record<string, string[]>) {}
}
