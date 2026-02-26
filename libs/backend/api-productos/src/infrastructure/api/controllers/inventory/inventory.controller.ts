import { Controller, Get, Post, Patch, Delete, Body, Param, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { CreateInventoryDto, UpdateInventoryDto } from '../../../../application/dto';
import {
  CreateInventoryCommand,
  UpdateInventoryCommand,
  DeleteInventoryCommand,
} from '../../../../application/cqrs/commands/inventario';
import { ListInventoryQuery, GetInventoryByIdQuery } from '../../../../application/cqrs/queries/inventario';

@ApiTags('inventory')
@ApiBearerAuth('access-token')
@Controller('inventory')
export class InventoryController {
  constructor(@Inject(IMediator) private readonly mediator: IMediatorPort) {}

  @Get()
  @ApiOperation({ summary: 'Listar inventario' })
  @ApiResponse({ status: 200, description: 'Lista de ítems de inventario.' })
  async list() {
    return this.mediator.execute(new ListInventoryQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener item por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async getById(@Param('id') id: string) {
    return this.mediator.execute(new GetInventoryByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear item de inventario' })
  async create(@Body() body: CreateInventoryDto) {
    return this.mediator.send(new CreateInventoryCommand(body));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar item de inventario' })
  async update(@Param('id') id: string, @Body() body: UpdateInventoryDto) {
    return this.mediator.send(new UpdateInventoryCommand(id, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar item de inventario' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async delete(@Param('id') id: string) {
    await this.mediator.send(new DeleteInventoryCommand(id));
    return { ok: true };
  }
}
