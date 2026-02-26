import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ type: String, example: 'user@biosstel.com', description: 'Email para recuperar contraseña.' })
  email?: string;
}
