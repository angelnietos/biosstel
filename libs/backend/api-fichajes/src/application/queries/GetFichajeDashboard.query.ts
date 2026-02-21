import type { IQuery } from '@biosstel/api-shared';

export class GetFichajeDashboardQuery implements IQuery {
  readonly type = 'GetFichajeDashboardQuery';
  constructor(public readonly date: string) {}
}
