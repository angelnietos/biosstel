import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { CreateProductCommand, UpdateProductCommand, DeleteProductCommand, UploadPlantillaProductCommand } from './commands/productos';
import { CreateInventoryCommand, UpdateInventoryCommand, DeleteInventoryCommand } from './commands/inventario';
import { ListProductsQuery, GetProductByIdQuery } from './queries/productos';
import { ListInventoryQuery, GetInventoryByIdQuery } from './queries/inventario';
import { GetReportsSummaryQuery } from './queries/reports';
import {
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
  UploadPlantillaProductHandler,
  ListProductsHandler,
  GetProductByIdHandler,
} from './handlers/productos';
import {
  CreateInventoryHandler,
  UpdateInventoryHandler,
  DeleteInventoryHandler,
  ListInventoryHandler,
  GetInventoryByIdHandler,
} from './handlers/inventario';
import { GetReportsSummaryHandler } from './handlers/reports';

@Injectable()
export class ProductosMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerCommandHandler(CreateProductCommand, CreateProductHandler);
    this.mediator.registerCommandHandler(UpdateProductCommand, UpdateProductHandler);
    this.mediator.registerCommandHandler(DeleteProductCommand, DeleteProductHandler);
    this.mediator.registerCommandHandler(UploadPlantillaProductCommand, UploadPlantillaProductHandler);
    this.mediator.registerCommandHandler(CreateInventoryCommand, CreateInventoryHandler);
    this.mediator.registerCommandHandler(UpdateInventoryCommand, UpdateInventoryHandler);
    this.mediator.registerCommandHandler(DeleteInventoryCommand, DeleteInventoryHandler);
    this.mediator.registerQueryHandler(ListProductsQuery, ListProductsHandler);
    this.mediator.registerQueryHandler(GetProductByIdQuery, GetProductByIdHandler);
    this.mediator.registerQueryHandler(ListInventoryQuery, ListInventoryHandler);
    this.mediator.registerQueryHandler(GetInventoryByIdQuery, GetInventoryByIdHandler);
    this.mediator.registerQueryHandler(GetReportsSummaryQuery, GetReportsSummaryHandler);
  }
}
