import type { ICommand } from '@biosstel/api-shared';

export class LogoutCommand implements ICommand {
  readonly type = 'LogoutCommand';
  constructor(public readonly refreshToken: string) {}
}

export interface LogoutResult {
  message: string;
}
