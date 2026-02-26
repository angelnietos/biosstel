import type { ICommand } from '@biosstel/api-shared';

export class DeleteInventoryCommand implements ICommand {
  readonly type = 'DeleteInventoryCommand';
  constructor(public readonly id: string) {}
}
