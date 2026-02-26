import type { ICommand } from '@biosstel/api-shared';

export class UpdateTaskCommand implements ICommand {
  readonly type = 'UpdateTaskCommand';
  constructor(
    public readonly taskId: string,
    public readonly data: { title?: string; description?: string; completed?: boolean }
  ) {}
}
