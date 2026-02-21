import { Controller, Get, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkCalendarEntity } from '../persistence/WorkCalendarEntity';

class CreateCalendarDto {
  @IsString()
  @ApiProperty({ type: String, example: 'Calendario estándar' })
  name!: string;
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'Lunes a Viernes' })
  description?: string;
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, default: false })
  isDefault?: boolean;
}

@ApiTags('fichajes')
@ApiBearerAuth('access-token')
@Controller('fichajes/calendars')
export class FichajesCalendarsController {
  constructor(
    @InjectRepository(WorkCalendarEntity)
    private readonly repo: Repository<WorkCalendarEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar calendarios laborales' })
  @ApiResponse({ status: 200, description: 'Lista de calendarios.' })
  async findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear calendario laboral' })
  @ApiResponse({ status: 201, description: 'Calendario creado.' })
  async create(@Body() dto: CreateCalendarDto) {
    try {
      const e = this.repo.create({
        name: dto.name ?? '',
        description: dto.description,
        isDefault: dto.isDefault ?? false,
      });
      return this.repo.save(e);
    } catch (err: any) {
      throw new BadRequestException(err?.message ?? 'Error al crear calendario');
    }
  }
}
