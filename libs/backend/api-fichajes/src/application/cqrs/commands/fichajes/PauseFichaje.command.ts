import type { ICommand } from '@biosstel/api-shared';

export class PauseFichajeCommand implements ICommand {
  readonly type = 'PauseFichajeCommand';
  constructor(
    public readonly fichajeId: string,
    public readonly reason?: string
  ) {}
}
