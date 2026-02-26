/**
 * @biosstel/api-operaciones - Operaciones Controller (CQRS vía IMediator)
 */

import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import { ListOperacionesQuery } from '../../../../application/cqrs/queries/operaciones/ListOperaciones.query';

@ApiTags('operaciones')
@ApiBearerAuth('access-token')
@Controller('operaciones')
export class OperacionesController {
  constructor(@Inject(IMediator) private readonly mediator: IMediatorPort) {}

  @Get()
  @ApiOperation({ summary: 'Listar operaciones', description: 'Obtiene la lista de operaciones.' })
  @ApiResponse({ status: 200, description: 'Lista de operaciones.' })
  async list() {
    return this.mediator.execute(new ListOperacionesQuery());
  }
}
