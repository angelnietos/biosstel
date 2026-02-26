/**
 * @biosstel/api-users - Infrastructure Layer: Users Controller (Input Adapter)
 *
 * REST controller that exposes user endpoints.
 * Uses CQRS: commands and queries dispatched via IMediator.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { User, PaginatedResult } from '@biosstel/shared-types';
import { CreateUserCommand, UpdateUserCommand, DeleteUserCommand } from '../../../../application/cqrs/commands/users';
import { GetUserByIdQuery, ListUsersQuery } from '../../../../application/cqrs/queries/users';
import type { CreateUserDto, UpdateUserDto, PaginationQueryDto } from '../../../../application/dto/users';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(IMediator) private readonly mediator: IMediatorPort
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar usuarios', description: 'Lista paginada de usuarios.' })
  @ApiResponse({ status: 200, description: 'Lista paginada (items, total, totalPages, page, pageSize).' })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResult<User>> {
    return this.mediator.execute(new ListUsersQuery(query.page ?? 1, query.pageSize ?? 10));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario', description: 'Usuario por ID.' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.mediator.execute(new GetUserByIdQuery(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear usuario', description: 'Alta de nuevo usuario.' })
  @ApiResponse({ status: 201, description: 'Usuario creado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.mediator.send(new CreateUserCommand(createUserDto));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar usuario', description: 'Modifica un usuario por ID.' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.mediator.send(new UpdateUserCommand(id, updateUserDto));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar usuario', description: 'Elimina un usuario por ID.' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.mediator.send(new DeleteUserCommand(id));
  }
}
