import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ProductosManagementUseCase, type PlantillaUploadFile } from '../../application/use-cases';
import { CreateProductDto } from './dto/CreateProductDto';
import { UpdateProductDto } from './dto/UpdateProductDto';

@ApiTags('productos')
@ApiBearerAuth('access-token')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosManagement: ProductosManagementUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
  async list() {
    return this.productosManagement.list();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  async getById(@Param('id') id: string) {
    return this.productosManagement.getById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear producto' })
  @ApiResponse({ status: 201, description: 'Producto creado.' })
  async create(@Body() body: CreateProductDto) {
    try {
      return this.productosManagement.create({
        codigo: body.codigo ?? '',
        nombre: body.nombre ?? '',
        familia: body.familia ?? '',
        estado: body.estado ?? 'Activo',
      });
    } catch (err: any) {
      throw new BadRequestException(err?.message ?? 'Error al crear producto');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    const data: { codigo?: string; nombre?: string; familia?: string; estado?: string } = {};
    if (body.codigo !== undefined) data.codigo = body.codigo;
    if (body.nombre !== undefined) data.nombre = body.nombre;
    if (body.familia !== undefined) data.familia = body.familia;
    if (body.estado !== undefined) data.estado = body.estado;
    return this.productosManagement.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async delete(@Param('id') id: string) {
    await this.productosManagement.delete(id);
    return { ok: true };
  }

  @Post(':id/plantilla')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  @ApiOperation({ summary: 'Subir plantilla del producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async uploadPlantilla(
    @Param('id') id: string,
    @UploadedFile() file: PlantillaUploadFile | undefined
  ) {
    if (!file || !file.buffer) throw new BadRequestException('Falta el archivo');
    return this.productosManagement.uploadPlantilla(id, file);
  }
}
