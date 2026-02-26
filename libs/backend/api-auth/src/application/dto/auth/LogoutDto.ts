import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LogoutDto {
  @IsString()
  @MinLength(1, { message: 'refresh_token es obligatorio' })
  @ApiProperty({ type: String, description: 'Refresh token a revocar.' })
  refresh_token!: string;
}
