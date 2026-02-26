import { Controller, Get, Post, Patch, Delete, Body, Param, UseInterceptors, UploadedFile, BadRequestException, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IMediator, type IMediatorPort } from '@biosstel/api-shared';
import { type PlantillaUploadFile } from '../../../../application/use-cases';
import type { CreateProductDto, UpdateProductDto } from '../../../../application/dto';
import {
  CreateProductCommand,
  UpdateProductCommand,
  DeleteProductCommand,
  UploadPlantillaProductCommand,
} from '../../../../application/cqrs/commands/productos';
import { ListProductsQuery, GetProductByIdQuery } from '../../../../application/cqrs/queries/productos';

@ApiTags('productos')
@ApiBearerAuth('access-token')
@Controller('productos')
export class ProductosController {
  constructor(@Inject(IMediator) private readonly mediator: IMediatorPort) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
  async list() {
    return this.mediator.execute(new ListProductsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  async getById(@Param('id') id: string) {
    return this.mediator.execute(new GetProductByIdQuery(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear producto' })
  @ApiResponse({ status: 201, description: 'Producto creado.' })
  async create(@Body() body: CreateProductDto) {
    return this.mediator.send(new CreateProductCommand(body));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.mediator.send(new UpdateProductCommand(id, body));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: '55ab5cb8-56bc-4da1-a865-81442fa07b11' })
  async delete(@Param('id') id: string) {
    await this.mediator.send(new DeleteProductCommand(id));
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
    return this.mediator.send(new UploadPlantillaProductCommand(id, file));
  }
}
