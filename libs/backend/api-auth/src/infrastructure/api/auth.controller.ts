/**
 * @biosstel/api-auth - Infrastructure Layer: Auth Controller (Input Adapter)
 * Login via CQRS (LoginCommand); refresh, forgot-password and me via use case.
 */

import { Body, Controller, Get, Post, Headers, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEmail, IsString, MinLength } from 'class-validator';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { User } from '@biosstel/shared-types';
import { AuthManagementUseCase } from '../../application/use-cases';
import { LoginCommand } from '../../application/commands/Login.command';
import { LoginDto } from './login.dto';

class ForgotPasswordDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ type: String, example: 'user@biosstel.com', description: 'Email para recuperar contraseña.' })
  email?: string;
}

class RefreshTokenDto {
  @IsString()
  @MinLength(1, { message: 'refresh_token es obligatorio' })
  @ApiProperty({ type: String, description: 'Refresh token obtenido en el login.' })
  refresh_token!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(IMediator) private readonly mediator: IMediatorPort,
    private readonly authManagement: AuthManagementUseCase
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Login',
    description:
      'Autenticación con email y contraseña. Devuelve access_token para usar en Authorize. Usuario por defecto: admin@biosstel.com / admin123',
  })
  @ApiResponse({ status: 201, description: 'access_token, refresh_token, expires_in y user.' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(@Body() body: LoginDto) {
    return this.mediator.send(
      new LoginCommand(body.email ?? '', body.password ?? '')
    );
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refrescar access token',
    description: 'Intercambia un refresh_token válido (no expirado) por un nuevo access_token y expires_in.',
  })
  @ApiResponse({ status: 200, description: 'Nuevo access_token y expires_in.' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado.' })
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authManagement.refresh(body.refresh_token ?? '');
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Usuario actual',
    description: 'Devuelve el usuario asociado al JWT (cabecera Authorization: Bearer <token>).',
  })
  async me(@Headers('authorization') authorization?: string): Promise<User> {
    return this.authManagement.getMe(authorization);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Recuperar contraseña',
    description: 'Solicita restablecimiento de contraseña por email.',
  })
  @ApiResponse({ status: 200, description: 'Solicitud aceptada.' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authManagement.forgotPassword(body);
  }
}
