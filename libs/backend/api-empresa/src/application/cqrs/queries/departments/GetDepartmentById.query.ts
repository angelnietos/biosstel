import type { IQuery } from '@biosstel/api-shared';

export class GetDepartmentByIdQuery implements IQuery {
  readonly type = 'GetDepartmentByIdQuery';
  constructor(public readonly id: string) {}
}
