import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateInventoryCommand } from '../../commands/inventario/UpdateInventory.command';
import type { InventoryManagementUseCase } from '../../../use-cases';

@CommandHandler(UpdateInventoryCommand)
@Injectable()
export class UpdateInventoryHandler implements ICommandHandler<UpdateInventoryCommand> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async execute(command: UpdateInventoryCommand): Promise<Awaited<ReturnType<InventoryManagementUseCase['update']>>> {
    return this.inventoryManagement.update(command.id, {
      codigo: command.data.codigo,
      nombre: command.data.nombre,
      cantidad: command.data.cantidad,
      ubicacion: command.data.ubicacion,
    });
  }
}
