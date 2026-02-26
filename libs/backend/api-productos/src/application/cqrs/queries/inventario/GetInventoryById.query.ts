import type { IQuery } from '@biosstel/api-shared';

export class GetInventoryByIdQuery implements IQuery {
  readonly type = 'GetInventoryByIdQuery';
  constructor(public readonly id: string) {}
}
