import type { IQuery } from '@biosstel/api-shared';

export class GetDashboardHomeQuery implements IQuery {
  readonly type = 'GetDashboardHomeQuery';
  constructor(public readonly filters?: Record<string, string[]>) {}
}
