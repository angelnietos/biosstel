import { Injectable, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateInventoryCommand } from '../../commands/inventario/CreateInventory.command';
import type { InventoryManagementUseCase as InventoryUseCaseType } from '../../../use-cases';
import { InventoryManagementUseCase } from '../../../use-cases';

@CommandHandler(CreateInventoryCommand)
@Injectable()
export class CreateInventoryHandler implements ICommandHandler<CreateInventoryCommand> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async execute(command: CreateInventoryCommand): Promise<Awaited<ReturnType<InventoryUseCaseType['create']>>> {
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
