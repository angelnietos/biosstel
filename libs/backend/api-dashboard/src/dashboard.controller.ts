import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('home')
  async home() {
    return this.dashboardService.getHome();
  }

  @Get('terminal-objectives')
  async terminalObjectives() {
    return this.dashboardService.getTerminalObjectives();
  }
}

