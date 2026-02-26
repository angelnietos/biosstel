import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { ProductPlain } from '../../../../domain/entities/Product';
import type { GetProductByIdQuery } from '../../queries/productos/GetProductById.query';
import type { ProductosManagementUseCase } from '../../../use-cases';

@Injectable()
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery, ProductPlain> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async handle(query: GetProductByIdQuery): Promise<ProductPlain> {
    const product = await this.productosManagement.getById(query.id);
    return product.toPlain();
  }
}
