import { Controller, Get, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkScheduleEntity } from '../persistence/WorkScheduleEntity';

class CreateScheduleDto {
  @IsString()
  @ApiProperty({ type: String, example: 'Jornada completa' })
  name!: string;
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, example: 1762 })
  hoursPerYear?: number;
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, example: 22 })
  vacationDays?: number;
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, example: 2 })
  freeDisposalDays?: number;
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, example: 8 })
  hoursPerDayWeekdays?: number;
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, example: 4 })
  hoursPerDaySaturday?: number;
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, example: 40 })
  hoursPerWeek?: number;
}

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
    } catch (err: any) {
      throw new BadRequestException(err?.message ?? 'Error al crear horario');
    }
  }
}
