import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { ProductPlain } from '../../../../domain/entities/Product';
import { GetProductByIdQuery } from '../../queries/productos/GetProductById.query';
import { ProductosManagementUseCase } from '../../../use-cases';

@QueryHandler(GetProductByIdQuery)
@Injectable()
export class GetProductByIdHandler implements IQueryHandler<GetProductByIdQuery> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async execute(query: GetProductByIdQuery): Promise<ProductPlain> {
    const product = await this.productosManagement.getById(query.id);
    return product.toPlain();
  }
}
