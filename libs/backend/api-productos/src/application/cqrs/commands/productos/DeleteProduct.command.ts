import type { ICommand } from '@biosstel/api-shared';

export class DeleteProductCommand implements ICommand {
  readonly type = 'DeleteProductCommand';
  constructor(public readonly id: string) {}
}
