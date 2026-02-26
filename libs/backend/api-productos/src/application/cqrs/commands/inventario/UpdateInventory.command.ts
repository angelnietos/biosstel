import type { ICommand } from '@biosstel/api-shared';
import type { UpdateInventoryDto } from '../../../dto/inventario';

export class UpdateInventoryCommand implements ICommand {
  readonly type = 'UpdateInventoryCommand';
  constructor(
    public readonly id: string,
    public readonly data: UpdateInventoryDto
  ) {}
}
