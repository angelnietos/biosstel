import type { ICommand } from '@biosstel/api-shared';
import type { UpdateDepartmentDto } from '../../../dto/departments';

export class UpdateDepartmentCommand implements ICommand {
  readonly type = 'UpdateDepartmentCommand';
  constructor(
    public readonly id: string,
    public readonly data: UpdateDepartmentDto
  ) {}
}
