import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FichajesController } from './infrastructure/api/fichajes.controller';
import { TasksController } from './infrastructure/api/tasks.controller';
import { FichajesCalendarsController } from './infrastructure/api/fichajes-calendars.controller';
import { FichajesSchedulesController } from './infrastructure/api/fichajes-schedules.controller';
import { FichajesPermissionsController } from './infrastructure/api/fichajes-permissions.controller';
import { FichajesManagementUseCase } from './application/use-cases';
import { FichajesService } from './fichajes.service';
import {
  FichajeEntity,
  TaskEntity,
  AgendaEntity,
  WorkCalendarEntity,
  WorkScheduleEntity,
  LeavePermissionTypeEntity,
} from './infrastructure/persistence';
import { IFichajeRepository } from './domain/repositories/IFichajeRepository';
import { ITaskRepository } from './domain/repositories/ITaskRepository';
import { PostgresFichajeRepository } from './infrastructure/persistence/postgres/PostgresFichajeRepository';
import { PostgresTaskRepository } from './infrastructure/persistence/postgres/PostgresTaskRepository';
import { ClockInHandler } from './application/handlers/ClockIn.handler';
import { ClockOutHandler } from './application/handlers/ClockOut.handler';
import { PauseFichajeHandler } from './application/handlers/PauseFichaje.handler';
import { ResumeFichajeHandler } from './application/handlers/ResumeFichaje.handler';
import { CreateTaskHandler } from './application/handlers/CreateTask.handler';
import { UpdateTaskHandler } from './application/handlers/UpdateTask.handler';
import { DeleteTaskHandler } from './application/handlers/DeleteTask.handler';
import { GetFichajesByUserHandler } from './application/handlers/GetFichajesByUser.handler';
import { GetCurrentFichajeHandler } from './application/handlers/GetCurrentFichaje.handler';
import { GetTasksByUserHandler } from './application/handlers/GetTasksByUser.handler';
import { GetTaskByIdHandler } from './application/handlers/GetTaskById.handler';
import { GetFichajeDashboardHandler } from './application/handlers/GetFichajeDashboard.handler';
import { FichajesMediatorRegistration } from './application/FichajesMediatorRegistration';

function getDatabaseAdapter(): 'postgres' | 'mongo' {
  try {
    const path = require('path');
    const fs = require('fs');
    const settingsPath = path.resolve(process.cwd(), 'settings.json');
    if (!fs.existsSync(settingsPath)) return 'postgres';
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    return settings.database?.adapter ?? 'postgres';
  } catch {
    return 'postgres';
  }
}

@Module({})
export class FichajesModule {
  static register(): DynamicModule {
    const adapter = getDatabaseAdapter();
    const imports = [];
    const providers: any[] = [
      FichajesManagementUseCase,
      FichajesService,
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
      FichajesMediatorRegistration,
    ];
    const exports = [
      FichajesManagementUseCase,
      FichajesService,
      IFichajeRepository,
      ITaskRepository,
    ];

    if (adapter === 'postgres') {
      imports.push(
        TypeOrmModule.forFeature([
          FichajeEntity,
          TaskEntity,
          AgendaEntity,
          WorkCalendarEntity,
          WorkScheduleEntity,
          LeavePermissionTypeEntity,
        ]),
      );
      // Explicit repository providers so Nest resolves them in this dynamic module
      providers.push(
        {
          provide: getRepositoryToken(WorkCalendarEntity),
          useFactory: (ds: DataSource) => ds.getRepository(WorkCalendarEntity),
          inject: [DataSource],
        },
        {
          provide: getRepositoryToken(WorkScheduleEntity),
          useFactory: (ds: DataSource) => ds.getRepository(WorkScheduleEntity),
          inject: [DataSource],
        },
        {
          provide: getRepositoryToken(LeavePermissionTypeEntity),
          useFactory: (ds: DataSource) => ds.getRepository(LeavePermissionTypeEntity),
          inject: [DataSource],
        },
        {
          provide: IFichajeRepository,
          useClass: PostgresFichajeRepository,
        },
        {
          provide: ITaskRepository,
          useClass: PostgresTaskRepository,
        },
      );
    } else {
      throw new Error(`Unsupported database adapter: ${adapter}`);
    }

    return {
      module: FichajesModule,
      imports,
      controllers: [
        FichajesController,
        TasksController,
        FichajesCalendarsController,
        FichajesSchedulesController,
        FichajesPermissionsController,
      ],
      providers,
      exports,
    };
  }
}

