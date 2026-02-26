import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController, InventoryController, ReportsController } from './infrastructure/api';
import { ProductosManagementUseCase, InventoryManagementUseCase, ReportsManagementUseCase } from './application/use-cases';

import { PRODUCT_REPOSITORY, INVENTORY_REPOSITORY } from './domain/repositories';
import { ProductosService } from './productos.service';
import { ProductosMediatorRegistration } from './application/cqrs/ProductosMediatorRegistration';
import {
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
  UploadPlantillaProductHandler,
  ListProductsHandler,
  GetProductByIdHandler,
  CreateInventoryHandler,
  UpdateInventoryHandler,
  DeleteInventoryHandler,
  ListInventoryHandler,
  GetInventoryByIdHandler,
  GetReportsSummaryHandler,
} from './application/cqrs/handlers';
import { PRODUCTOS_POSTGRES_ENTITIES, PostgresProductRepository, PostgresInventoryRepository } from './infrastructure/persistence/postgres';

@Module({
  imports: [
    TypeOrmModule.forFeature([...PRODUCTOS_POSTGRES_ENTITIES]),
  ],
  controllers: [ProductosController, InventoryController, ReportsController],
  providers: [
    { provide: PRODUCT_REPOSITORY, useClass: PostgresProductRepository },
    { provide: INVENTORY_REPOSITORY, useClass: PostgresInventoryRepository },
    PostgresProductRepository,
    PostgresInventoryRepository,
    ProductosManagementUseCase,
    InventoryManagementUseCase,
    ReportsManagementUseCase,
    ProductosService,
    ProductosMediatorRegistration,
    CreateProductHandler,
    UpdateProductHandler,
    DeleteProductHandler,
    UploadPlantillaProductHandler,
    ListProductsHandler,
    GetProductByIdHandler,
    CreateInventoryHandler,
    UpdateInventoryHandler,
    DeleteInventoryHandler,
    ListInventoryHandler,
    GetInventoryByIdHandler,
    GetReportsSummaryHandler,
  ],
  exports: [ProductosManagementUseCase, InventoryManagementUseCase, ReportsManagementUseCase, ProductosService],
})
export class ProductosModule {}
