import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PauseBodyDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  reason?: string;
}
