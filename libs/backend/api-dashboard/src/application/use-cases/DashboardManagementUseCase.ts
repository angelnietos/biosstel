/**
 * @biosstel/api-dashboard - Application Layer: Dashboard Management Use Case
 * 
 * Use case that implements dashboard business logic.
 * It uses the output port (IDashboardRepository) to access data.
 */

import { Injectable } from '@nestjs/common';
import type { IDashboardManagement } from '../ports/input/IDashboardManagement';
import type {
  DashboardHomeResponse,
  TerminalObjectivesResponse,
} from '@biosstel/shared-types';
import { TypeOrmDashboardRepository } from '../../infrastructure/persistence/TypeOrmDashboardRepository';

@Injectable()
export class DashboardManagementUseCase implements IDashboardManagement {
  constructor(
    private readonly dashboardRepository: TypeOrmDashboardRepository,
  ) {}

  async getDashboardHome(filters?: Record<string, string[]>): Promise<DashboardHomeResponse> {
    // Business logic: Apply filters, calculate metrics, etc.
    return this.dashboardRepository.getDashboardHome(filters);
  }

  async getTerminalObjectives(filters?: Record<string, string[]>): Promise<TerminalObjectivesResponse> {
    // Business logic: Apply filters, aggregate data, etc.
    return this.dashboardRepository.getTerminalObjectives(filters);
  }
}
