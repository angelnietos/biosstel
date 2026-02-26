import type { IQuery } from '@biosstel/api-shared';

export class GetTaskByIdQuery implements IQuery {
  readonly type = 'GetTaskByIdQuery';
  constructor(public readonly taskId: string) {}
}
