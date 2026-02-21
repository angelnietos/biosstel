export {
  default as dashboardReducer,
  fetchDashboardHome,
  fetchTerminalObjectives,
  fetchTerminalObjectivesByPeriod,
  patchTerminalObjectiveThunk,
  clearError,
} from './dashboardSlice';
export type { DashboardState, FetchTerminalByPeriodArg, PatchTerminalObjectiveArg } from './dashboardSlice';