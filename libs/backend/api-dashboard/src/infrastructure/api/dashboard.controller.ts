/**
 * @biosstel/api-dashboard - Infrastructure Layer: Dashboard Controller (Input Adapter)
 * 
 * REST controller that exposes dashboard endpoints.
 * This is the input adapter in the hexagonal architecture.
 */

import { Controller, Get, Query } from '@nestjs/common';
import { DashboardManagementUseCase } from '../../application/use-cases';
import type { DashboardHomeResponse, TerminalObjectivesResponse } from '@biosstel/shared-types';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardManagement: DashboardManagementUseCase,
  ) {}

  @Get('home')
  async home(@Query() filters?: Record<string, string[]>): Promise<DashboardHomeResponse> {
    return this.dashboardManagement.getDashboardHome(filters);
  }

  @Get('terminal-objectives')
  async terminalObjectives(@Query() filters?: Record<string, string[]>): Promise<TerminalObjectivesResponse> {
    return this.dashboardManagement.getTerminalObjectives(filters);
  }
}


