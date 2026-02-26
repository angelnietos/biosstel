import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateWorkCenterDto {
  @IsString()
  @ApiProperty({ type: String, example: 'Barakaldo' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'C/ Ejemplo 1' })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    example: 'c1d4e5f6-0000-4000-8000-000000000001',
    description: 'UUID de un departamento existente (opcional). Omitir si no aplica.',
  })
  departmentId?: string;
}
