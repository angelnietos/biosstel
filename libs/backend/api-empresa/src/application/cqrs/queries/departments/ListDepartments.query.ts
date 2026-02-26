import type { IQuery } from '@biosstel/api-shared';

export class ListDepartmentsQuery implements IQuery {
  readonly type = 'ListDepartmentsQuery';
  constructor(public readonly activeOnly = true) {}
}
