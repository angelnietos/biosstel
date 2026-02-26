import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, default: 1 })
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ type: Number, default: 10 })
  pageSize?: number = 10;
}
