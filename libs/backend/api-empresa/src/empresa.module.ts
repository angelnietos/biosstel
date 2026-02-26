/**
 * @biosstel/api-empresa - NestJS Module
 * Event-driven: suscrito a UserCreated (asignar org/centro por defecto).
 * Persistencia: departments, work_centers (TypeORM).
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EMPRESA_POSTGRES_ENTITIES,
  PostgresDepartmentRepository,
  PostgresWorkCenterRepository,
} from './infrastructure/persistence/postgres';
import { DEPARTMENT_REPOSITORY } from './domain/repositories';
import { WORK_CENTER_REPOSITORY } from './domain/repositories/work-centers';
import { EmpresaController, DepartmentsController, WorkCentersController } from './infrastructure/api';
import { EmpresaManagementUseCase } from './application/use-cases';
import { EmpresaMediatorRegistration } from './application/cqrs/EmpresaMediatorRegistration';
import {
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
  ListDepartmentsHandler,
  GetDepartmentByIdHandler,
  UserCreatedEmpresaHandler,
} from './application/cqrs/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([...EMPRESA_POSTGRES_ENTITIES])],
  controllers: [EmpresaController, DepartmentsController, WorkCentersController],
  providers: [
    { provide: DEPARTMENT_REPOSITORY, useClass: PostgresDepartmentRepository },
    { provide: WORK_CENTER_REPOSITORY, useClass: PostgresWorkCenterRepository },
    PostgresDepartmentRepository,
    PostgresWorkCenterRepository,
    EmpresaManagementUseCase,
    UserCreatedEmpresaHandler,
    EmpresaMediatorRegistration,
    CreateDepartmentHandler,
    UpdateDepartmentHandler,
    DeleteDepartmentHandler,
    ListDepartmentsHandler,
    GetDepartmentByIdHandler,
  ],
  exports: [EmpresaManagementUseCase],
})
export class EmpresaModule {}
