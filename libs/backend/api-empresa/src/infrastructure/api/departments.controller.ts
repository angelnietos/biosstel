/**
 * @biosstel/api-empresa - CRUD Departamentos
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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiPropertyOptional, ApiParam } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { TypeOrmDepartmentRepository } from '../persistence/TypeOrmDepartmentRepository';
import type { Department } from '@biosstel/shared-types';

class CreateDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'DEP-01' })
  code?: string;
  @IsString()
  @ApiProperty({ type: String, example: 'Comercial' })
  name!: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  color?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  responsibleUserId?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  dateFrom?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  dateTo?: string;
}

class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  code?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  name?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  color?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  responsibleUserId?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  dateFrom?: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  dateTo?: string;
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isActive?: boolean;
}

@ApiTags('empresa')
@ApiBearerAuth('access-token')
@Controller('empresa/departments')
export class DepartmentsController {
  constructor(private readonly departmentRepo: TypeOrmDepartmentRepository) {}

  @Get()
  @ApiOperation({ summary: 'Listar departamentos' })
  async findAll(): Promise<Department[]> {
    return this.departmentRepo.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener departamento por ID' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'c1d4e5f6-0000-4000-8000-000000000001' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const d = await this.departmentRepo.findById(id);
    if (!d) return null;
    return { id: d.id, name: d.name, color: d.color };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear departamento (Añadir Departamento)' })
  async create(@Body() dto: CreateDepartmentDto) {
    try {
      const entity = await this.departmentRepo.create({
        name: dto.name ?? '',
        code: dto.code,
        color: dto.color,
        responsibleUserId: dto.responsibleUserId,
        dateFrom: dto.dateFrom,
        dateTo: dto.dateTo,
      });
      return { id: entity.id, name: entity.name, color: entity.color };
    } catch (err: any) {
      throw new BadRequestException(err?.message ?? 'Error al crear departamento');
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar departamento' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDepartmentDto) {
    const entity = await this.departmentRepo.update(id, dto);
    return { id: entity.id, name: entity.name, color: entity.color };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar departamento' })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'c1d4e5f6-0000-4000-8000-000000000001' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.departmentRepo.delete(id);
  }
}
