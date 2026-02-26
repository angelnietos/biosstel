import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Mediator } from '@biosstel/api-shared';
import {
  ClockInCommand,
  ClockOutCommand,
  PauseFichajeCommand,
  ResumeFichajeCommand,
  CreateTaskCommand,
  UpdateTaskCommand,
  DeleteTaskCommand,
} from './commands/fichajes';
import {
  GetFichajesByUserQuery,
  GetCurrentFichajeQuery,
  GetTasksByUserQuery,
  GetTaskByIdQuery,
  GetFichajeDashboardQuery,
} from './queries/fichajes';
import {
  ClockInHandler,
  ClockOutHandler,
  PauseFichajeHandler,
  ResumeFichajeHandler,
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
  GetFichajesByUserHandler,
  GetCurrentFichajeHandler,
  GetTasksByUserHandler,
  GetTaskByIdHandler,
  GetFichajeDashboardHandler,
} from './handlers/fichajes';

@Injectable()
export class FichajesMediatorRegistration implements OnModuleInit {
  constructor(private readonly mediator: Mediator) {}

  onModuleInit(): void {
    this.mediator.registerCommandHandler(ClockInCommand, ClockInHandler);
    this.mediator.registerCommandHandler(ClockOutCommand, ClockOutHandler);
    this.mediator.registerCommandHandler(PauseFichajeCommand, PauseFichajeHandler);
    this.mediator.registerCommandHandler(ResumeFichajeCommand, ResumeFichajeHandler);
    this.mediator.registerCommandHandler(CreateTaskCommand, CreateTaskHandler);
    this.mediator.registerCommandHandler(UpdateTaskCommand, UpdateTaskHandler);
    this.mediator.registerCommandHandler(DeleteTaskCommand, DeleteTaskHandler);
    this.mediator.registerQueryHandler(GetFichajesByUserQuery, GetFichajesByUserHandler);
    this.mediator.registerQueryHandler(GetCurrentFichajeQuery, GetCurrentFichajeHandler);
    this.mediator.registerQueryHandler(GetTasksByUserQuery, GetTasksByUserHandler);
    this.mediator.registerQueryHandler(GetTaskByIdQuery, GetTaskByIdHandler);
    this.mediator.registerQueryHandler(GetFichajeDashboardQuery, GetFichajeDashboardHandler);
  }
}
