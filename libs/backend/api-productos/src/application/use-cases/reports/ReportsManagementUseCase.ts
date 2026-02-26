import { Injectable } from '@nestjs/common';
import type { ReportsSummaryResponse } from '@biosstel/shared-types';
import type { TypeOrmProductRepository } from '../../../infrastructure/persistence';
import type { TypeOrmInventoryRepository } from '../../../infrastructure/persistence';

@Injectable()
export class ReportsManagementUseCase {
  constructor(
    private readonly productRepository: TypeOrmProductRepository,
    private readonly inventoryRepository: TypeOrmInventoryRepository,
  ) {}

  async getSummary(): Promise<ReportsSummaryResponse> {
    const [products, items] = await Promise.all([
      this.productRepository.findAll(),
      this.inventoryRepository.findAll(),
    ]);
    const activos = products.filter((p) => (p.estado || '').toLowerCase() === 'activo').length;
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
