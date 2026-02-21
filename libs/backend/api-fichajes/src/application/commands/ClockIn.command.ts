import type { ICommand } from '@biosstel/api-shared';

export class ClockInCommand implements ICommand {
  readonly type = 'ClockInCommand';
  constructor(
    public readonly userId: string,
    public readonly location?: { lat: number; lng: number }
  ) {}
}
