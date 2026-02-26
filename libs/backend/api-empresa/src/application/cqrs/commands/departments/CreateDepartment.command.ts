import type { ICommand } from '@biosstel/api-shared';
import type { CreateDepartmentDto } from '../../../dto/departments';

export class CreateDepartmentCommand implements ICommand {
  readonly type = 'CreateDepartmentCommand';
  constructor(public readonly data: CreateDepartmentDto) {}
}
