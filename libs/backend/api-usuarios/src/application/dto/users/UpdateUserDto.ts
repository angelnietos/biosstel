import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsBoolean, IsUUID } from 'class-validator';
import type { UpdateUserData } from '@biosstel/shared-types';

export class UpdateUserDto implements UpdateUserData {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ type: String })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  lastName?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  password?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  workCenterId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  role?: string;
}
