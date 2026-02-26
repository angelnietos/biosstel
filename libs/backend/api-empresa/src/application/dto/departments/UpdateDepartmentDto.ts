import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  code?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  name?: string;

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

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isActive?: boolean;
}
