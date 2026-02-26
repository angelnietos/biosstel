import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @ApiProperty({ type: String, example: 'REF-001' })
  codigo!: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Producto A' })
  nombre!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, example: 'Familia 1', required: false })
  familia?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'Activo' })
  estado?: string;
}
