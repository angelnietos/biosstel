import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  codigo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  nombre?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number })
  cantidad?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  ubicacion?: string;
}
