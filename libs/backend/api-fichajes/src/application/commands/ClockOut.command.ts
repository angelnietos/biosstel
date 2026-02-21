import type { ICommand } from '@biosstel/api-shared';

export class ClockOutCommand implements ICommand {
  readonly type = 'ClockOutCommand';
  constructor(public readonly fichajeId: string) {}
}
