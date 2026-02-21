import type { ICommand } from '@biosstel/api-shared';

export class DeleteUserCommand implements ICommand {
  readonly type = 'DeleteUserCommand';
  constructor(public readonly id: string) {}
}
