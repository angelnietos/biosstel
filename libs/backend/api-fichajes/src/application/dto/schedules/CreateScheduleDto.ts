import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateScheduleDto {
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
