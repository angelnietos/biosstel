import { Injectable } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import type { Product, ProductPlain } from '../../../../domain/entities/Product';
import { ListProductsQuery } from '../../queries/productos/ListProducts.query';
import { ProductosManagementUseCase } from '../../../use-cases';

@QueryHandler(ListProductsQuery)
@Injectable()
export class ListProductsHandler implements IQueryHandler<ListProductsQuery> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async execute(_query: ListProductsQuery): Promise<{ products: ProductPlain[] }> {
    const { products } = await this.productosManagement.list();
    return { products: products.map((p: Product) => p.toPlain()) };
  }
}
