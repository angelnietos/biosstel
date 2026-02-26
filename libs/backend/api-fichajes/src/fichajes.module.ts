import { Module, type DynamicModule, type Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  FichajesController,
  TasksController,
  FichajesCalendarsController,
  FichajesSchedulesController,
  FichajesPermissionsController,
} from './infrastructure/api';
import { FichajesManagementUseCase } from './application/use-cases';
import {
  FICHAJES_POSTGRES_ENTITIES,
  getFichajesPostgresProviders,
} from './infrastructure/persistence/postgres';
import { I_FICHAJE_REPOSITORY, I_TASK_REPOSITORY } from './domain/repositories';
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
} from './application/cqrs/handlers';
import { FichajesMediatorRegistration } from './application/cqrs/FichajesMediatorRegistration';
import { getFeatureAdapter } from '@biosstel/api-shared';
import { UsersModule } from '@biosstel/api-usuarios';

@Module({})
export class FichajesModule {
  static register(): DynamicModule {
    const adapter = getFeatureAdapter('fichajes') as 'postgres' | 'mongo';
    const imports: DynamicModule['imports'] = [
      ConfigModule,
      UsersModule,
      JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => {
          const expiresIn = config.get<string>('JWT_ACCESS_EXPIRES_IN') || config.get<string>('JWT_EXPIRES_IN') || '15m';
          return {
            secret: config.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
            signOptions: { expiresIn: expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}` },
          };
        },
        inject: [ConfigService],
      }),
    ];
    const providers: Provider[] = [
      FichajesManagementUseCase,
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
      I_FICHAJE_REPOSITORY,
      I_TASK_REPOSITORY,
    ];

    if (adapter === 'postgres') {
      imports.push(TypeOrmModule.forFeature([...FICHAJES_POSTGRES_ENTITIES]));
      providers.push(...getFichajesPostgresProviders());
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

