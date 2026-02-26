/**
 * @biosstel/api-fichajes - Infrastructure Layer: Fichajes Controller (Input Adapter)
 * CQRS: commands and queries dispatched via IMediator.
 */

import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  Inject,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { Fichaje } from '@biosstel/shared-types';
import {
  ClockInCommand,
  ClockOutCommand,
  PauseFichajeCommand,
  ResumeFichajeCommand,
} from '../../../../application/cqrs/commands/fichajes';
import {
  GetFichajesByUserQuery,
  GetCurrentFichajeQuery,
  GetFichajeDashboardQuery,
} from '../../../../application/cqrs/queries/fichajes';
import type { FichajeDashboardRow } from '../../../../domain/repositories';
import type { ClockInBodyDto, PauseBodyDto } from '../../../../application/dto/fichajes';

@ApiTags('fichajes')
@ApiBearerAuth('access-token')
@Controller('fichajes')
export class FichajesController {
  constructor(
    @Inject(IMediator) private readonly mediator: IMediatorPort,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Dashboard de fichajes (vista manager)' })
  @ApiQuery({ name: 'date', required: false, type: String, example: '2026-02-20', description: 'Fecha YYYY-MM-DD (opcional, por defecto hoy).' })
  async getDashboard(@Query('date') date?: string): Promise<FichajeDashboardRow[]> {
    const today = date ?? new Date().toISOString().split('T')[0];
    return this.mediator.execute(new GetFichajeDashboardQuery(today));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Fichajes por usuario' })
  @ApiParam({ name: 'userId', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b' })
  async getByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Fichaje[]> {
    return this.mediator.execute(new GetFichajesByUserQuery(userId));
  }

  @Get('current')
  @ApiOperation({ summary: 'Fichaje actual (sin cerrar)', description: 'Query: userId. Incluye fueraHorario si aplica.' })
  @ApiQuery({ name: 'userId', type: String, format: 'uuid', example: 'f2ce86c5-0406-403e-a6dc-8a55d91f480b', required: true })
  @ApiResponse({ status: 200, description: 'Fichaje en curso o null.' })
  async getCurrent(@Query('userId') userId: string): Promise<Fichaje | null> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return null;
    }
    return this.mediator.execute(new GetCurrentFichajeQuery(userId));
  }

  @Post('clock-in')
  @ApiOperation({ summary: 'Entrada' })
  async clockIn(@Body() body: ClockInBodyDto, @Req() req: Request): Promise<Fichaje> {
    let userId = typeof body?.userId === 'string' ? body.userId.trim() : '';
    if (!userId) {
      const token = req.headers?.authorization?.replace(/^Bearer\s+/i, '').trim();
      if (token) {
        try {
          const payload = this.jwtService.verify<{ sub?: string }>(token);
          userId = typeof payload?.sub === 'string' ? payload.sub.trim() : '';
        } catch {
          // token invalid or expired; keep userId empty
        }
      }
    }
    if (!userId) {
      throw new BadRequestException('userId es obligatorio para fichar entrada');
    }
    return this.mediator.send(
      new ClockInCommand(userId, body?.location)
    );
  }

  @Post(':fichajeId/clock-out')
  @ApiOperation({ summary: 'Salida' })
  @ApiParam({ name: 'fichajeId', type: String, format: 'uuid', example: 'e0000000-0000-0000-0000-000000000001' })
  @ApiResponse({ status: 200, description: 'Fichaje cerrado.' })
  async clockOut(
    @Param('fichajeId', ParseUUIDPipe) fichajeId: string
  ): Promise<Fichaje> {
    return this.mediator.send(new ClockOutCommand(fichajeId));
  }

  @Post(':fichajeId/pause')
  @ApiOperation({ summary: 'Pausar' })
  @ApiParam({ name: 'fichajeId', type: String, format: 'uuid', example: 'e0000000-0000-0000-0000-000000000001' })
  @ApiResponse({ status: 200, description: 'Fichaje pausado.' })
  async pause(
    @Param('fichajeId', ParseUUIDPipe) fichajeId: string,
    @Body() body?: PauseBodyDto
  ): Promise<Fichaje> {
    return this.mediator.send(new PauseFichajeCommand(fichajeId, body?.reason));
  }

  @Post(':fichajeId/resume')
  @ApiOperation({ summary: 'Reanudar' })
  @ApiParam({ name: 'fichajeId', type: String, format: 'uuid', example: 'e0000000-0000-0000-0000-000000000001' })
  @ApiResponse({ status: 200, description: 'Fichaje reanudado.' })
  async resume(@Param('fichajeId', ParseUUIDPipe) fichajeId: string): Promise<Fichaje> {
    return this.mediator.send(new ResumeFichajeCommand(fichajeId));
  }
}
