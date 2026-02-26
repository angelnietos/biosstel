import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'DEP-01' })
  code?: string;

  @IsString()
  @ApiProperty({ type: String, example: 'Comercial' })
  name!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  color?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  responsibleUserId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  dateFrom?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  dateTo?: string;
}
