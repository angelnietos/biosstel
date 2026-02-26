import type { IQuery } from '@biosstel/api-shared';

export class GetProductByIdQuery implements IQuery {
  readonly type = 'GetProductByIdQuery';
  constructor(public readonly id: string) {}
}
