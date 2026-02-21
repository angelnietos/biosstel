import type { ICommand } from '@biosstel/api-shared';
import type { UpdateUserData } from '@biosstel/shared-types';

export class UpdateUserCommand implements ICommand {
  readonly type = 'UpdateUserCommand';
  constructor(
    public readonly id: string,
    public readonly data: UpdateUserData
  ) {}
}
