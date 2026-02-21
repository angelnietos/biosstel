import type { ICommand } from '@biosstel/api-shared';

export class DeleteTaskCommand implements ICommand {
  readonly type = 'DeleteTaskCommand';
  constructor(public readonly taskId: string) {}
}
