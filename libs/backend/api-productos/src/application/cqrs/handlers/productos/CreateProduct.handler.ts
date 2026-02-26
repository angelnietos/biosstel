import { Injectable, BadRequestException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { ProductPlain } from '../../../../domain/entities/Product';
import type { CreateProductCommand } from '../../commands/productos/CreateProduct.command';
import type { ProductosManagementUseCase } from '../../../use-cases';

@Injectable()
export class CreateProductHandler implements ICommandHandler<CreateProductCommand, ProductPlain> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async handle(command: CreateProductCommand): Promise<ProductPlain> {
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
