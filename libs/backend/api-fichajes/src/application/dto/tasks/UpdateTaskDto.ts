import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  completed?: boolean;
}
