import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import { CreateDepartmentCommand, UpdateDepartmentCommand, DeleteDepartmentCommand } from './commands/departments';
import { ListDepartmentsQuery, GetDepartmentByIdQuery } from './queries/departments';
import {
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
  ListDepartmentsHandler,
  GetDepartmentByIdHandler,
} from './handlers/departments';

@Injectable()
export class EmpresaMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerCommandHandler(CreateDepartmentCommand, CreateDepartmentHandler);
    this.mediator.registerCommandHandler(UpdateDepartmentCommand, UpdateDepartmentHandler);
    this.mediator.registerCommandHandler(DeleteDepartmentCommand, DeleteDepartmentHandler);
    this.mediator.registerQueryHandler(ListDepartmentsQuery, ListDepartmentsHandler);
    this.mediator.registerQueryHandler(GetDepartmentByIdQuery, GetDepartmentByIdHandler);
  }
}
