import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './infrastructure/api/productos.controller';
import { InventoryController } from './infrastructure/api/inventory.controller';
import { ReportsController } from './infrastructure/api/reports.controller';
import { ProductosManagementUseCase, InventoryManagementUseCase, ReportsManagementUseCase } from './application/use-cases';
import { ProductEntity, InventoryItemEntity, TypeOrmProductRepository, TypeOrmInventoryRepository } from './infrastructure/persistence';
import { ProductosService } from './productos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, InventoryItemEntity]),
  ],
  controllers: [ProductosController, InventoryController, ReportsController],
  providers: [
    TypeOrmProductRepository,
    TypeOrmInventoryRepository,
    ProductosManagementUseCase,
    InventoryManagementUseCase,
    ReportsManagementUseCase,
    ProductosService,
  ],
  exports: [ProductosManagementUseCase, InventoryManagementUseCase, ReportsManagementUseCase, ProductosService],
})
export class ProductosModule {}
