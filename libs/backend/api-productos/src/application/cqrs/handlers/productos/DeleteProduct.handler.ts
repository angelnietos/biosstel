import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from '../../commands/productos/DeleteProduct.command';
import type { ProductosManagementUseCase } from '../../../use-cases';

@CommandHandler(DeleteProductCommand)
@Injectable()
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    await this.productosManagement.delete(command.id);
  }
}
