import { Injectable } from '@nestjs/common';
import type { IQueryHandler } from '@biosstel/api-shared';
import type { Product, ProductPlain } from '../../../../domain/entities/Product';
import type { ListProductsQuery } from '../../queries/productos/ListProducts.query';
import type { ProductosManagementUseCase } from '../../../use-cases';

@Injectable()
export class ListProductsHandler implements IQueryHandler<ListProductsQuery, { products: ProductPlain[] }> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async handle(_query: ListProductsQuery): Promise<{ products: ProductPlain[] }> {
    const { products } = await this.productosManagement.list();
    return { products: products.map((p: Product) => p.toPlain()) };
  }
}
