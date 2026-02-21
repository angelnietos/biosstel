import type { IQuery } from '@biosstel/api-shared';

export class GetTasksByUserQuery implements IQuery {
  readonly type = 'GetTasksByUserQuery';
  constructor(public readonly userId: string) {}
}
