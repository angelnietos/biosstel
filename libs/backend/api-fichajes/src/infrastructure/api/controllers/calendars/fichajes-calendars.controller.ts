import { Controller, Get, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { WorkCalendarEntity } from '../../../persistence';
import type { CreateCalendarDto } from '../../../../application/dto';

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear calendario';
      throw new BadRequestException(message);
    }
  }
}
