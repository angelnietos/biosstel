import type { IQuery } from '@biosstel/api-shared';

export class ListUsersQuery implements IQuery {
  readonly type = 'ListUsersQuery';
  constructor(
    public readonly page = 1,
    public readonly pageSize = 10
  ) {}
}
