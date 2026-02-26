import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO para POST /api/auth/login.
 * Usuario por defecto (tras db:seed): admin@biosstel.com / admin123
 */
export class LoginDto {
  @ApiProperty({
    example: 'admin@biosstel.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'admin123',
    description: 'Contraseña',
  })
  @IsString()
  @MinLength(1, { message: 'La contraseña es obligatoria' })
  password!: string;
}
