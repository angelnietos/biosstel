import type { ICommand } from '@biosstel/api-shared';
import type { CreateProductDto } from '../../../dto/productos';

export class CreateProductCommand implements ICommand {
  readonly type = 'CreateProductCommand';
  constructor(public readonly data: CreateProductDto) {}
}
