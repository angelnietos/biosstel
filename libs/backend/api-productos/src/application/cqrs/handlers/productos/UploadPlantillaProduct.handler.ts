import { Injectable, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadPlantillaProductCommand } from '../../commands/productos/UploadPlantillaProduct.command';
import type { ProductosManagementUseCase } from '../../../use-cases';

@CommandHandler(UploadPlantillaProductCommand)
@Injectable()
export class UploadPlantillaProductHandler implements ICommandHandler<UploadPlantillaProductCommand> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async execute(command: UploadPlantillaProductCommand): Promise<{ ok: boolean; path: string }> {
    const fileWithBuffer = command.file as { buffer?: Buffer } | undefined;
    if (!command.file?.buffer && !fileWithBuffer?.buffer) {
      throw new BadRequestException('Falta el archivo');
    }
    return this.productosManagement.uploadPlantilla(command.productId, command.file);
  }
}
