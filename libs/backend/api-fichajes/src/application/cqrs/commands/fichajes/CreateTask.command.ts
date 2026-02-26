import type { ICommand } from '@biosstel/api-shared';

export class CreateTaskCommand implements ICommand {
  readonly type = 'CreateTaskCommand';
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly description?: string
  ) {}
}
