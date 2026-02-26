import type { IQuery } from '@biosstel/api-shared';

export class GetCurrentFichajeQuery implements IQuery {
  readonly type = 'GetCurrentFichajeQuery';
  constructor(public readonly userId: string) {}
}
