import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsIn, Min, MaxLength, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssignmentDto {
  @IsIn(['department', 'person'])
  @ApiProperty({ enum: ['department', 'person'], description: 'Tipo de asignación.' })
  groupType!: 'department' | 'person';

  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String, example: 'Comercial', description: 'Nombre del grupo (departamento o persona).' })
  groupTitle!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String, description: 'Etiqueta de la fila (por defecto groupTitle).' })
  label?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 0 })
  sortOrder?: number;
}
