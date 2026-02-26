import type { ICommand } from '@biosstel/api-shared';

export class RefreshTokenCommand implements ICommand {
  readonly type = 'RefreshTokenCommand';
  constructor(public readonly refreshToken: string) {}
}

export interface RefreshTokenResult {
  access_token: string;
  expires_in: number;
}
