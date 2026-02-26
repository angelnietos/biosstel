import { Injectable, Inject } from '@nestjs/common';
import type { ReportsSummaryResponse } from '@biosstel/shared-types';
import type { IProductRepository, IInventoryRepository } from '../../../domain/repositories';
import { PRODUCT_REPOSITORY, INVENTORY_REPOSITORY } from '../../../domain/repositories';
import type { Product } from '../../../domain/entities/Product';

@Injectable()
export class ReportsManagementUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(INVENTORY_REPOSITORY)
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  async getSummary(): Promise<ReportsSummaryResponse> {
    const [products, items] = await Promise.all([
      this.productRepository.findAll(),
      this.inventoryRepository.findAll(),
    ]);
    const activos = products.filter((p: Product) => (p.estado || '').toLowerCase() === 'activo').length;
    return {
      summary: [
        { id: '1', label: 'Productos activos', value: activos, unit: 'unidades' },
        { id: '2', label: 'Items en inventario', value: items.length, unit: 'unidades' },
        { id: '3', label: 'Total productos', value: products.length, unit: 'unidades' },
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}
