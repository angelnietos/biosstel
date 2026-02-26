/**
 * @biosstel/api-dashboard - Application Layer: Input Port
 *
 * Input port for dashboard management operations.
 */

import type { DashboardHomeResponse, TerminalObjectivesResponse } from '@biosstel/shared-types';

export interface IDashboardManagement {
  /**
   * Get dashboard home data (objectives + alerts)
   */
  getDashboardHome(filters?: Record<string, string[]>): Promise<DashboardHomeResponse>;

  /**
   * Get terminal objectives data (header + assignments)
   */
  getTerminalObjectives(filters?: Record<string, string[]>): Promise<TerminalObjectivesResponse>;
}
