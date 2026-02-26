import { Injectable, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import type { ProductPlain } from '../../../../domain/entities/Product';
import { CreateProductCommand } from '../../commands/productos/CreateProduct.command';
import { ProductosManagementUseCase } from '../../../use-cases';

@CommandHandler(CreateProductCommand)
@Injectable()
export class CreateProductHandler implements ICommandHandler<CreateProductCommand> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async execute(command: CreateProductCommand): Promise<ProductPlain> {
    try {
      const product = await this.productosManagement.create({
        codigo: command.data.codigo ?? '',
        nombre: command.data.nombre ?? '',
        familia: command.data.familia ?? '',
        estado: command.data.estado ?? 'Activo',
      });
      return product.toPlain();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear producto';
      throw new BadRequestException(message);
    }
  }
}
