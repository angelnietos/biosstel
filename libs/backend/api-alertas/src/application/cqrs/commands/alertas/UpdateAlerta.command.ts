import type { ICommand } from '@biosstel/api-shared';
import type { UpdateAlertData } from '../../../../domain/repositories';

export class UpdateAlertaCommand implements ICommand {
  readonly type = 'UpdateAlertaCommand';
  constructor(
    public readonly id: string,
    public readonly data: UpdateAlertData
  ) {}
}
