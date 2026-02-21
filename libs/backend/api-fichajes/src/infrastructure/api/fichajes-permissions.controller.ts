import { Controller, Get, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LeavePermissionTypeEntity } from '../persistence/LeavePermissionTypeEntity';

class CreatePermissionDto {
  @IsString()
  @ApiProperty({ type: String, example: 'Vacaciones' })
  name!: string;
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, default: true })
  isPaid?: boolean;
}

@ApiTags('fichajes')
@ApiBearerAuth('access-token')
@Controller('fichajes/permission-types')
export class FichajesPermissionsController {
  constructor(
    @InjectRepository(LeavePermissionTypeEntity)
    private readonly repo: Repository<LeavePermissionTypeEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar tipos de permiso' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de permiso.' })
  async findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear tipo de permiso (Nuevo Permiso)' })
  @ApiResponse({ status: 201, description: 'Tipo de permiso creado.' })
  async create(@Body() dto: CreatePermissionDto) {
    try {
      const e = this.repo.create({ name: dto.name ?? '', isPaid: dto.isPaid ?? true });
      return this.repo.save(e);
    } catch (err: any) {
      throw new BadRequestException(err?.message ?? 'Error al crear tipo de permiso');
    }
  }
}
