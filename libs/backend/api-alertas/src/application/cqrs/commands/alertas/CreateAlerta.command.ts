import type { ICommand } from '@biosstel/api-shared';
import type { CreateAlertData } from '../../../../domain/repositories';

export class CreateAlertaCommand implements ICommand {
  readonly type = 'CreateAlertaCommand';
  constructor(public readonly data: CreateAlertData) {}
}
