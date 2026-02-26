import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteInventoryCommand } from '../../commands/inventario/DeleteInventory.command';
import type { InventoryManagementUseCase } from '../../../use-cases';

@CommandHandler(DeleteInventoryCommand)
@Injectable()
export class DeleteInventoryHandler implements ICommandHandler<DeleteInventoryCommand> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async execute(command: DeleteInventoryCommand): Promise<void> {
    await this.inventoryManagement.delete(command.id);
  }
}
