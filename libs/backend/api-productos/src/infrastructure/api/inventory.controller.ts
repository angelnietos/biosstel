import { Controller, Get, Post, Patch, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InventoryManagementUseCase } from '../../application/use-cases';
import { CreateInventoryDto } from './dto/CreateInventoryDto';
import { UpdateInventoryDto } from './dto/UpdateInventoryDto';

@ApiTags('inventory')
@ApiBearerAuth('access-token')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryManagement: InventoryManagementUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar inventario' })
  @ApiResponse({ status: 200, description: 'Lista de ítems de inventario.' })
  async list() {
    return this.inventoryManagement.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener item por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async getById(@Param('id') id: string) {
    return this.inventoryManagement.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear item de inventario' })
  async create(@Body() body: CreateInventoryDto) {
    try {
      return this.inventoryManagement.create({
        codigo: body.codigo ?? '',
        nombre: body.nombre ?? '',
        cantidad: body.cantidad ?? 0,
        ubicacion: body.ubicacion,
      });
    } catch (err: any) {
      throw new BadRequestException(err?.message ?? 'Error al crear item de inventario');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar item de inventario' })
  async update(@Param('id') id: string, @Body() body: UpdateInventoryDto) {
    return this.inventoryManagement.update(id, {
      codigo: body.codigo,
      nombre: body.nombre,
      cantidad: body.cantidad,
      ubicacion: body.ubicacion,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar item de inventario' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async delete(@Param('id') id: string) {
    await this.inventoryManagement.delete(id);
    return { ok: true };
  }
}
