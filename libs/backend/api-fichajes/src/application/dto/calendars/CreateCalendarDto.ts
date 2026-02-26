import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCalendarDto {
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
