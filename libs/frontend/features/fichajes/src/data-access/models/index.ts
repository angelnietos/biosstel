/**
 * Tipos de estado/dominio (store fichajes).
 */
import type { Fichaje, Tarea } from '../../api/services/models';

export interface Permiso {
  id: string;
  userId: string;
  type: 'vacaciones' | 'asunto_propio' | 'baja_medica' | 'otro';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
}

export interface FichajesState {
  currentFichaje: Fichaje | null;
  history: Fichaje[];
  tasks: Tarea[];
  selectedTask: Tarea | null;
  permisos: Permiso[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}
