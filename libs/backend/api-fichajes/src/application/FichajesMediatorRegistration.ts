import { Injectable, OnModuleInit } from '@nestjs/common';
import { Mediator } from '@biosstel/api-shared';
import { ClockInCommand } from './commands/ClockIn.command';
import { ClockOutCommand } from './commands/ClockOut.command';
import { PauseFichajeCommand } from './commands/PauseFichaje.command';
import { ResumeFichajeCommand } from './commands/ResumeFichaje.command';
import { CreateTaskCommand } from './commands/CreateTask.command';
import { UpdateTaskCommand } from './commands/UpdateTask.command';
import { DeleteTaskCommand } from './commands/DeleteTask.command';
import { GetFichajesByUserQuery } from './queries/GetFichajesByUser.query';
import { GetCurrentFichajeQuery } from './queries/GetCurrentFichaje.query';
import { GetTasksByUserQuery } from './queries/GetTasksByUser.query';
import { GetTaskByIdQuery } from './queries/GetTaskById.query';
import { GetFichajeDashboardQuery } from './queries/GetFichajeDashboard.query';
import { ClockInHandler } from './handlers/ClockIn.handler';
import { ClockOutHandler } from './handlers/ClockOut.handler';
import { PauseFichajeHandler } from './handlers/PauseFichaje.handler';
import { ResumeFichajeHandler } from './handlers/ResumeFichaje.handler';
import { CreateTaskHandler } from './handlers/CreateTask.handler';
import { UpdateTaskHandler } from './handlers/UpdateTask.handler';
import { DeleteTaskHandler } from './handlers/DeleteTask.handler';
import { GetFichajesByUserHandler } from './handlers/GetFichajesByUser.handler';
import { GetCurrentFichajeHandler } from './handlers/GetCurrentFichaje.handler';
import { GetTasksByUserHandler } from './handlers/GetTasksByUser.handler';
import { GetTaskByIdHandler } from './handlers/GetTaskById.handler';
import { GetFichajeDashboardHandler } from './handlers/GetFichajeDashboard.handler';

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
