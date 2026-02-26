import { Injectable } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { DeleteProductCommand } from '../../commands/productos/DeleteProduct.command';
import type { ProductosManagementUseCase } from '../../../use-cases';

@Injectable()
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand, void> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async handle(command: DeleteProductCommand): Promise<void> {
    await this.productosManagement.delete(command.id);
  }
}
