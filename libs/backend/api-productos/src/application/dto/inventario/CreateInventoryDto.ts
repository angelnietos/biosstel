import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  @ApiProperty({ type: String, example: 'INV-001' })
  codigo!: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Stock A' })
  nombre!: string;

  @IsNumber()
  @ApiProperty({ type: Number, example: 100 })
  cantidad!: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'Almacén 1' })
  ubicacion?: string;
}
