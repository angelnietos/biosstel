import type { ICommand } from '@biosstel/api-shared';
import type { CreateInventoryDto } from '../../../dto/inventario';

export class CreateInventoryCommand implements ICommand {
  readonly type = 'CreateInventoryCommand';
  constructor(public readonly data: CreateInventoryDto) {}
}
