import type { IQuery } from '@biosstel/api-shared';

export class GetMeQuery implements IQuery {
  readonly type = 'GetMeQuery';
  constructor(public readonly accessToken: string) {}
}
