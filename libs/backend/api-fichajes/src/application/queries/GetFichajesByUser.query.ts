import type { IQuery } from '@biosstel/api-shared';

export class GetFichajesByUserQuery implements IQuery {
  readonly type = 'GetFichajesByUserQuery';
  constructor(public readonly userId: string) {}
}
