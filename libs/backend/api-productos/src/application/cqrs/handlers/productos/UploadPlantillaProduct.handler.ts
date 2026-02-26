import { Injectable, BadRequestException } from '@nestjs/common';
import type { ICommandHandler } from '@biosstel/api-shared';
import type { UploadPlantillaProductCommand } from '../../commands/productos/UploadPlantillaProduct.command';
import type { ProductosManagementUseCase } from '../../../use-cases';

@Injectable()
export class UploadPlantillaProductHandler implements ICommandHandler<UploadPlantillaProductCommand, { ok: boolean; path: string }> {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  async handle(command: UploadPlantillaProductCommand): Promise<{ ok: boolean; path: string }> {
    const fileWithBuffer = command.file as { buffer?: Buffer } | undefined;
    if (!command.file?.buffer && !fileWithBuffer?.buffer) {
      throw new BadRequestException('Falta el archivo');
    }
    return this.productosManagement.uploadPlantilla(command.productId, command.file);
  }
}
