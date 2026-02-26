/**
 * @biosstel/api-auth - Infrastructure Layer: Auth Controller (Input Adapter)
 * All operations routed through CQRS (LoginCommand, RefreshTokenCommand, ForgotPasswordCommand, GetMeQuery).
 */

import { Body, Controller, Get, Post, Headers, Inject, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { User } from '@biosstel/shared-types';
import { LoginCommand, RefreshTokenCommand, ForgotPasswordCommand } from '../../../../application/cqrs/commands';
import { GetMeQuery } from '../../../../application/cqrs/queries';
import type { LoginDto, ForgotPasswordDto, RefreshTokenDto } from '../../../../application/dto/auth';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(IMediator) private readonly mediator: IMediatorPort,
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
    return this.mediator.send(
      new RefreshTokenCommand(body.refresh_token ?? '')
    );
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Usuario actual',
    description: 'Devuelve el usuario asociado al JWT (cabecera Authorization: Bearer <token>).',
  })
  async me(@Headers('authorization') authorization?: string): Promise<User> {
    return this.mediator.execute(new GetMeQuery(authorization ?? ''));
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Recuperar contraseña',
    description: 'Solicita restablecimiento de contraseña por email.',
  })
  @ApiResponse({ status: 200, description: 'Solicitud aceptada.' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.mediator.send(
      new ForgotPasswordCommand(body.email ?? '')
    );
  }
}
