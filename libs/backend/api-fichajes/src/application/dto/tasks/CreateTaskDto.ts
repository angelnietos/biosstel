import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @ApiProperty({
    type: String,
    description: 'ID del usuario propietario de la tarea.',
    example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b',
  })
  userId!: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Revisar documentación' })
  title!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  description?: string;
}
