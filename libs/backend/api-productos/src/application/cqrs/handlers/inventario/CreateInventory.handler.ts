import { Injectable, BadRequestException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { CreateInventoryCommand } from '../../commands/inventario/CreateInventory.command';
import type { InventoryManagementUseCase } from '../../../use-cases';

@Injectable()
export class CreateInventoryHandler implements ICommandHandler<CreateInventoryCommand, Awaited<ReturnType<InventoryManagementUseCase['create']>>> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async handle(command: CreateInventoryCommand): Promise<Awaited<ReturnType<InventoryManagementUseCase['create']>>> {
    try {
      return this.inventoryManagement.create({
        codigo: command.data.codigo ?? '',
        nombre: command.data.nombre ?? '',
        cantidad: command.data.cantidad ?? 0,
        ubicacion: command.data.ubicacion,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear item de inventario';
      throw new BadRequestException(message);
    }
  }
}
