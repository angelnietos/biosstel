import type { ICommand } from '@biosstel/api-shared';
import type { UpdateProductDto } from '../../../dto/productos';

export class UpdateProductCommand implements ICommand {
  readonly type = 'UpdateProductCommand';
  constructor(
    public readonly id: string,
    public readonly data: UpdateProductDto
  ) {}
}
