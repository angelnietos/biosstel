import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  @MinLength(1, { message: 'refresh_token es obligatorio' })
  @ApiProperty({ type: String, description: 'Refresh token obtenido en el login.' })
  refresh_token!: string;
}
