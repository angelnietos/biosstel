/**
 * Servicio de aplicación (facade) para el dominio productos.
 * Expone los use cases para inyección desde otros módulos si se necesita.
 */
import { Injectable } from '@nestjs/common';
import { ProductosManagementUseCase } from './application/use-cases/ProductosManagementUseCase';
import { InventoryManagementUseCase } from './application/use-cases/InventoryManagementUseCase';
import { ReportsManagementUseCase } from './application/use-cases/ReportsManagementUseCase';

@Injectable()
export class ProductosService {
  constructor(
    public readonly productos: ProductosManagementUseCase,
    public readonly inventory: InventoryManagementUseCase,
    public readonly reports: ReportsManagementUseCase,
  ) {}
}
