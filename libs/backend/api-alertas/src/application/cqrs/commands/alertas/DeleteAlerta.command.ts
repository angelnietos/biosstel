import type { ICommand } from '@biosstel/api-shared';

export class DeleteAlertaCommand implements ICommand {
  readonly type = 'DeleteAlertaCommand';
  constructor(public readonly id: string) {}
}
