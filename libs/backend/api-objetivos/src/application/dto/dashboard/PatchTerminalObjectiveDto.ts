import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PatchTerminalObjectiveDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, description: 'Activar (true) o desactivar (false) el objetivo.' })
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'Valor logrado.' })
  achieved?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'Meta/objetivo.' })
  objective?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'Porcentaje (se recalcula si se envía objective).' })
  pct?: number;
}
