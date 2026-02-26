import { Controller, Get, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { WorkScheduleEntity } from '../../../persistence';
import type { CreateScheduleDto } from '../../../../application/dto';

@ApiTags('fichajes')
@ApiBearerAuth('access-token')
@Controller('fichajes/schedules')
export class FichajesSchedulesController {
  constructor(
    @InjectRepository(WorkScheduleEntity)
    private readonly repo: Repository<WorkScheduleEntity>,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar horarios laborales' })
  @ApiResponse({ status: 200, description: 'Lista de horarios.' })
  async findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear horario laboral' })
  @ApiResponse({ status: 201, description: 'Horario creado.' })
  async create(@Body() dto: CreateScheduleDto) {
    try {
      const e = this.repo.create({
        name: dto.name ?? '',
        hoursPerYear: dto.hoursPerYear,
        vacationDays: dto.vacationDays,
        freeDisposalDays: dto.freeDisposalDays,
        hoursPerDayWeekdays: dto.hoursPerDayWeekdays,
        hoursPerDaySaturday: dto.hoursPerDaySaturday,
        hoursPerWeek: dto.hoursPerWeek,
      });
      return this.repo.save(e);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear horario';
      throw new BadRequestException(message);
    }
  }
}
