import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, IsUUID } from 'class-validator';
import type { CreateUserData } from '@biosstel/shared-types';

export class CreateUserDto implements CreateUserData {
  @IsEmail()
  @ApiProperty({ type: String, example: 'user@biosstel.com' })
  email!: string;

  @IsString()
  @MinLength(1, { message: 'La contraseña es obligatoria' })
  @ApiProperty({ type: String, example: 'secret123', minLength: 1 })
  password!: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'Juan' })
  firstName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'García' })
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String })
  organizationId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ type: String, example: 'COMERCIAL' })
  role?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({ type: String })
  workCenterId?: string;
}
