import type { IQuery } from '@biosstel/api-shared';

export class GetUserByIdQuery implements IQuery {
  readonly type = 'GetUserByIdQuery';
  constructor(public readonly id: string) {}
}
