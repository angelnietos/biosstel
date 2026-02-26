import type { ICommand } from '@biosstel/api-shared';
import type { PlantillaUploadFile } from '../../../use-cases';

export class UploadPlantillaProductCommand implements ICommand {
  readonly type = 'UploadPlantillaProductCommand';
  constructor(
    public readonly productId: string,
    public readonly file: PlantillaUploadFile
  ) {}
}
