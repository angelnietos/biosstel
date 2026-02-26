export interface TareasPaths {
  home: string;
  pendingTasks: string;
  registerTasks: string;
}

export const DEFAULT_TAREAS_PATHS: TareasPaths = {
  home: '/home',
  pendingTasks: '/home/pending-tasks',
  registerTasks: '/home/register-tasks',
};
