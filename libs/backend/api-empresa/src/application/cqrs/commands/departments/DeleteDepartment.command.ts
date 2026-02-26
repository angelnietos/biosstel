import type { ICommand } from '@biosstel/api-shared';

export class DeleteDepartmentCommand implements ICommand {
  readonly type = 'DeleteDepartmentCommand';
  constructor(public readonly id: string) {}
}
