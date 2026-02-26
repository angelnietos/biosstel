import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ProductPlain } from '../../../../domain/entities/Product';
import { UpdateProductCommand } from '../../commands/productos/UpdateProduct.command';
import { ProductosManagementUseCase } from '../../../use-cases';

@CommandHandler(UpdateProductCommand)
@Injectable()
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async execute(command: UpdateProductCommand): Promise<ProductPlain> {
    const data: { codigo?: string; nombre?: string; familia?: string; estado?: string } = {};
    if (command.data.codigo !== undefined) data.codigo = command.data.codigo;
    if (command.data.nombre !== undefined) data.nombre = command.data.nombre;
    if (command.data.familia !== undefined) data.familia = command.data.familia;
    if (command.data.estado !== undefined) data.estado = command.data.estado;
    const product = await this.productosManagement.update(command.id, data);
    return product.toPlain();
  }
}
