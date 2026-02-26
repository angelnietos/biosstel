import type { ICommand } from '@biosstel/api-shared';
import type { CreateUserData } from '@biosstel/shared-types';

export class CreateUserCommand implements ICommand {
  readonly type = 'CreateUserCommand';
  constructor(public readonly data: CreateUserData) {}
}
