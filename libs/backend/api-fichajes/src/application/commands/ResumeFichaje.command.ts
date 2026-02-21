import type { ICommand } from '@biosstel/api-shared';

export class ResumeFichajeCommand implements ICommand {
  readonly type = 'ResumeFichajeCommand';
  constructor(public readonly fichajeId: string) {}
}
