import { Injectable } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { DeleteInventoryCommand } from '../../commands/inventario/DeleteInventory.command';
import type { InventoryManagementUseCase } from '../../../use-cases';

@Injectable()
export class DeleteInventoryHandler implements ICommandHandler<DeleteInventoryCommand, void> {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  async handle(command: DeleteInventoryCommand): Promise<void> {
    await this.inventoryManagement.delete(command.id);
  }
}
