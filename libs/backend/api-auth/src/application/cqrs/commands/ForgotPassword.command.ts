import type { ICommand } from '@biosstel/api-shared';

export class ForgotPasswordCommand implements ICommand {
  readonly type = 'ForgotPasswordCommand';
  constructor(public readonly email: string) {}
}
