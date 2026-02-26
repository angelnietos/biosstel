/**
 * @biosstel/api-empresa - CRUD Centros de trabajo
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
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import type { PostgresWorkCenterRepository } from '../../../persistence/postgres/work-centers';
import type { WorkCenter } from '@biosstel/shared-types';
import type { CreateWorkCenterDto, UpdateWorkCenterDto } from '../../../../application/dto/work-centers';

@ApiTags('empresa')
@ApiBearerAuth('access-token')
@Controller('empresa/work-centers')
export class WorkCentersController {
  constructor(private readonly workCenterRepo: PostgresWorkCenterRepository) {}

  @Get()
  @ApiOperation({ summary: 'Listar centros de trabajo' })
  async findAll(): Promise<WorkCenter[]> {
    return this.workCenterRepo.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener centro por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'c1d4e5f6-0000-4000-8000-000000000001' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const w = await this.workCenterRepo.findById(id);
    if (!w) return null;
    return { id: w.id, name: w.name, address: w.address };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear centro de trabajo (Añadir Punto de venta)' })
  async create(@Body() dto: CreateWorkCenterDto) {
    try {
      const sanitized = {
        name: dto.name ?? '',
        address: dto.address,
        departmentId: this.isValidUuid(dto.departmentId) ? dto.departmentId : undefined,
      };
      const entity = await this.workCenterRepo.create(sanitized);
      return { id: entity.id, name: entity.name, address: entity.address };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear centro de trabajo';
      throw new BadRequestException(message);
    }
  }

  private isValidUuid(s: string | null | undefined): boolean {
    if (s == null || typeof s !== 'string' || s.trim() === '') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(s.trim());
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar centro de trabajo' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'c1d4e5f6-0000-4000-8000-000000000001' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateWorkCenterDto) {
    const entity = await this.workCenterRepo.update(id, dto);
    return { id: entity.id, name: entity.name, address: entity.address };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar centro de trabajo' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'c1d4e5f6-0000-4000-8000-000000000001' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.workCenterRepo.delete(id);
  }
}
