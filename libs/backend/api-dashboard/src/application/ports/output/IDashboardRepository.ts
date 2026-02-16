/**
 * @biosstel/api-dashboard - Application Layer: Dashboard Repository Port
 * 
 * This interface defines the contract for dashboard data persistence.
 * Implementations will be in the infrastructure layer.
 */

import type {
  DashboardHomeResponse,
  TerminalObjectivesResponse,
} from '@biosstel/shared-types';

export interface IDashboardRepository {
  /**
   * Get dashboard home data (objectives + alerts)
   */
  getDashboardHome(filters?: Record<string, string[]>): Promise<DashboardHomeResponse>;

  /**
   * Get terminal objectives data (header + assignments)
   */
  getTerminalObjectives(filters?: Record<string, string[]>): Promise<TerminalObjectivesResponse>;
}
