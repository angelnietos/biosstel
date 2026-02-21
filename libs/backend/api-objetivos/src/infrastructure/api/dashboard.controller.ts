/**
 * @biosstel/api-dashboard - Infrastructure Layer: Dashboard Controller (Input Adapter)
 *
 * CQRS: queries dispatched via IMediator.
 */

import { Controller, Get, Patch, Post, Delete, Query, Param, Body, Inject, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiPropertyOptional, ApiParam, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsNumber, IsString, IsIn, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import type { IMediatorPort } from '@biosstel/api-shared';
import { IMediator } from '@biosstel/api-shared';
import type { DashboardHomeResponse, TerminalObjectivesResponse } from '@biosstel/shared-types';
import { GetDashboardHomeQuery } from '../../application/queries/GetDashboardHome.query';
import { GetTerminalObjectivesQuery } from '../../application/queries/GetTerminalObjectives.query';
import { DashboardService } from '../../dashboard.service';

class PatchTerminalObjectiveDto {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ type: Boolean, description: 'Activar (true) o desactivar (false) el objetivo.' })
  isActive?: boolean;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'Valor logrado.' })
  achieved?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'Meta/objetivo.' })
  objective?: number;
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, description: 'Porcentaje (se recalcula si se envía objective).' })
  pct?: number;
}

class CreateAssignmentDto {
  @IsIn(['department', 'person'])
  @ApiProperty({ enum: ['department', 'person'], description: 'Tipo de asignación.' })
  groupType!: 'department' | 'person';
  @IsString()
  @MaxLength(255)
  @ApiProperty({ type: String, example: 'Comercial', description: 'Nombre del grupo (departamento o persona).' })
  groupTitle!: string;
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @ApiPropertyOptional({ type: String, description: 'Etiqueta de la fila (por defecto groupTitle).' })
  label?: string;
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 0 })
  sortOrder?: number;
}

@ApiTags('objetivos')
@ApiBearerAuth('access-token')
@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(IMediator) private readonly mediator: IMediatorPort,
    private readonly dashboardService: DashboardService
  ) {}

  @Get('home')
  @ApiOperation({ summary: 'Dashboard home', description: 'Datos del dashboard principal.' })
  async home(@Query() filters?: Record<string, string[]>): Promise<DashboardHomeResponse> {
    return this.mediator.execute(new GetDashboardHomeQuery(filters));
  }

  @Get('terminal-objectives')
  @ApiOperation({
    summary: 'Objetivos terminales',
    description: 'Lista de objetivos por terminal/filtros. Query: type=contratos|puntos, period=YYYY-MM (opcional).',
  })
  @ApiResponse({ status: 200, description: 'Cabecera y asignaciones del objetivo.' })
  async terminalObjectives(
    @Query() filters?: Record<string, string[]>
  ): Promise<TerminalObjectivesResponse> {
    return this.mediator.execute(new GetTerminalObjectivesQuery(filters));
  }

  @Patch('terminal-objectives/:id')
  @ApiOperation({
    summary: 'Desactivar/activar objetivo terminal',
    description: 'PATCH con body { isActive: boolean }.',
  })
  @ApiParam({ name: 'id', type: String, format: 'uuid', example: 'a0000000-0000-0000-0000-000000000001' })
  @ApiResponse({ status: 200, description: 'Objetivo actualizado.' })
  async patchTerminalObjective(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: PatchTerminalObjectiveDto
  ): Promise<{ id: string; isActive: boolean }> {
    return this.dashboardService.patchTerminalObjective(id, {
      isActive: body.isActive,
      achieved: body.achieved,
      objective: body.objective,
      pct: body.pct,
    });
  }

  @Post('terminal-objectives/:id/assignments')
  @ApiOperation({ summary: 'Añadir asignación (departamento o persona) al objetivo terminal' })
  @ApiParam({ name: 'id', type: String, format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Asignación creada.' })
  async createAssignment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAssignmentDto
  ) {
    return this.dashboardService.createTerminalAssignment(id, {
      groupType: dto.groupType,
      groupTitle: dto.groupTitle,
      label: dto.label ?? dto.groupTitle,
      sortOrder: dto.sortOrder ?? 0,
    });
  }

  @Delete('terminal-objectives/:objectiveId/assignments/:assignmentId')
  @ApiOperation({ summary: 'Eliminar asignación' })
  @ApiParam({ name: 'objectiveId', type: String, format: 'uuid' })
  @ApiParam({ name: 'assignmentId', type: String, format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Asignación eliminada.' })
  async deleteAssignment(
    @Param('objectiveId', ParseUUIDPipe) objectiveId: string,
    @Param('assignmentId', ParseUUIDPipe) assignmentId: string
  ) {
    await this.dashboardService.deleteTerminalAssignment(objectiveId, assignmentId);
    return { ok: true };
  }
}
