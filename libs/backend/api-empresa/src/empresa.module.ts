/**
 * @biosstel/api-empresa - NestJS Module
 * Event-driven: suscrito a UserCreated (asignar org/centro por defecto).
 * Persistencia: departments, work_centers (TypeORM).
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentEntity, WorkCenterEntity } from './infrastructure/persistence';
import { TypeOrmDepartmentRepository } from './infrastructure/persistence/TypeOrmDepartmentRepository';
import { TypeOrmWorkCenterRepository } from './infrastructure/persistence/TypeOrmWorkCenterRepository';
import { EmpresaController } from './infrastructure/api/empresa.controller';
import { DepartmentsController } from './infrastructure/api/departments.controller';
import { WorkCentersController } from './infrastructure/api/work-centers.controller';
import { EmpresaManagementUseCase } from './application/use-cases';
import { EmpresaService } from './empresa.service';
import { UserCreatedEmpresaHandler } from './application/handlers/UserCreatedEmpresa.handler';

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentEntity, WorkCenterEntity])],
  controllers: [EmpresaController, DepartmentsController, WorkCentersController],
  providers: [
    TypeOrmDepartmentRepository,
    TypeOrmWorkCenterRepository,
    EmpresaManagementUseCase,
    EmpresaService,
    UserCreatedEmpresaHandler,
  ],
  exports: [EmpresaManagementUseCase, EmpresaService],
})
export class EmpresaModule {}
