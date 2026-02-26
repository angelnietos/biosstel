/**
 * @biosstel/api-empresa - CRUD Departamentos (CQRS vía IMediator)
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { CreateDepartmentDto, UpdateDepartmentDto } from '../../../../application/dto';
import {
  CreateDepartmentCommand,
  UpdateDepartmentCommand,
  DeleteDepartmentCommand,
} from '../../../../application/cqrs/commands/departments';
import { ListDepartmentsQuery, GetDepartmentByIdQuery } from '../../../../application/cqrs/queries/departments';

@ApiTags('empresa')
@ApiBearerAuth('access-token')
@Controller('empresa/departments')
export class DepartmentsController {
  constructor(@Inject(IMediator) private readonly mediator: IMediatorPort) {}

  @Get()
  @ApiOperation({ summary: 'Listar departamentos' })
  async findAll() {
    return this.mediator.execute(new ListDepartmentsQuery(true));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener departamento por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'c1d4e5f6-0000-4000-8000-000000000001' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediator.execute(new GetDepartmentByIdQuery(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear departamento (Añadir Departamento)' })
  async create(@Body() dto: CreateDepartmentDto) {
    return this.mediator.send(new CreateDepartmentCommand(dto));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar departamento' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDepartmentDto) {
    return this.mediator.send(new UpdateDepartmentCommand(id, dto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar departamento' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'c1d4e5f6-0000-4000-8000-000000000001' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.mediator.send(new DeleteDepartmentCommand(id));
  }
}
