/**
 * @biosstel/api-fichajes - Tasks Controller (CQRS via IMediator).
 */

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { FichajeTask } from '@biosstel/shared-types';
import {
  CreateTaskCommand,
  UpdateTaskCommand,
  DeleteTaskCommand,
} from '../../../../application/cqrs/commands/task';
import {
  GetTasksByUserQuery,
  GetTaskByIdQuery,
} from '../../../../application/cqrs/queries/task';
import type { CreateTaskDto, UpdateTaskDto } from '../../../../application/dto';

@ApiTags('fichajes')
@ApiBearerAuth('access-token')
@Controller('tasks')
export class TasksController {
  constructor(@Inject(IMediator) private readonly mediator: IMediatorPort) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Tareas por usuario' })
  @ApiParam({ name: 'userId', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  async getByUser(@Param('userId') userId: string): Promise<FichajeTask[]> {
    return this.mediator.execute(new GetTasksByUserQuery(userId));
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Obtener tarea por ID' })
  async getById(@Param('taskId', ParseUUIDPipe) taskId: string): Promise<FichajeTask> {
    return this.mediator.execute(new GetTaskByIdQuery(taskId));
  }

  @Post()
  @ApiOperation({ summary: 'Crear tarea' })
  async create(@Body() body: CreateTaskDto): Promise<FichajeTask> {
    const userId = body?.userId?.trim() ?? '';
    const title = body?.title?.trim() ?? '';
    if (!userId) throw new BadRequestException('userId es obligatorio');
    if (!title) throw new BadRequestException('title es obligatorio');
    return this.mediator.send(
      new CreateTaskCommand(userId, title, body?.description)
    );
  }

  @Patch(':taskId')
  @ApiOperation({ summary: 'Actualizar tarea' })
  @ApiParam({ name: 'taskId', type: String, format: 'uuid', example: 'e0000000-0000-0000-0000-000000000002' })
  @ApiResponse({ status: 200, description: 'Tarea actualizada.' })
  async update(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body() body: UpdateTaskDto
  ): Promise<FichajeTask> {
    return this.mediator.send(new UpdateTaskCommand(taskId, body));
  }

  @Delete(':taskId')
  @ApiOperation({ summary: 'Eliminar tarea' })
  @ApiParam({ name: 'taskId', type: String, format: 'uuid', example: 'e0000000-0000-0000-0000-000000000002' })
  async delete(@Param('taskId', ParseUUIDPipe) taskId: string): Promise<void> {
    await this.mediator.send(new DeleteTaskCommand(taskId));
  }
}
