/**
 * Tipos para el log de flujo (solo dev). Cada entrada puede usarse como contexto para IA o tests.
 */
export type FlowLogKind =
  | 'navigation'
  | 'api_request'
  | 'api_response'
  | 'api_error'
  | 'form_submit'
  | 'user_action'
  | 'error';

export interface FlowLogEntry {
  t: number;
  ts: string;
  kind: FlowLogKind;
  [key: string]: unknown;
}
