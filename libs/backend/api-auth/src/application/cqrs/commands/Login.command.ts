import type { ICommand } from '@biosstel/api-shared';

export interface LoginResult {
  access_token: string;
  refresh_token: string;
  /** Tiempo de vida del access token en segundos */
  expires_in: number;
  user: { id: string; email: string; role?: string };
}

export class LoginCommand implements ICommand {
  readonly type = 'LoginCommand';
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}
