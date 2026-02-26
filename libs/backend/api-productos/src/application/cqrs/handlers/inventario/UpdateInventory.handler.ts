import { Injectable } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { UpdateInventoryCommand } from '../../commands/inventario/UpdateInventory.command';
import type { InventoryManagementUseCase } from '../../../use-cases';

@Injectable()
export class UpdateInventoryHandler implements ICommandHandler<UpdateInventoryCommand, Awaited<ReturnType<InventoryManagementUseCase['update']>>> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async handle(command: UpdateInventoryCommand): Promise<Awaited<ReturnType<InventoryManagementUseCase['update']>>> {
    return this.inventoryManagement.update(command.id, {
      codigo: command.data.codigo,
      nombre: command.data.nombre,
      cantidad: command.data.cantidad,
      ubicacion: command.data.ubicacion,
    });
  }
}
