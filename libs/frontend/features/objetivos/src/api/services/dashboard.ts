/**
 * @biosstel/objetivos - Dashboard services (HTTP calls)
 */

import type { DashboardHomeResponse, TerminalObjectivesResponse } from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

function buildQuery(filters?: Record<string, string[]>) {
  if (!filters) return '';
  const params = new URLSearchParams();
  for (const [key, values] of Object.entries(filters)) {
    if (!values || values.length === 0) continue;
    params.set(key, values.join(','));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function getDashboardHome(
  filters?: Record<string, string[]>
): Promise<DashboardHomeResponse> {
  const res = await fetch(`${API_BASE_URL}/dashboard/home${buildQuery(filters)}`, {
    method: 'GET',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  return handleResponse(res);
}

export async function getTerminalObjectives(
  filters?: Record<string, string[]>
): Promise<TerminalObjectivesResponse> {
  const res = await fetch(
    `${API_BASE_URL}/dashboard/terminal-objectives${buildQuery(filters)}`,
    {
      method: 'GET',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      cache: 'no-store',
    }
  );
  return handleResponse(res);
}

export async function patchTerminalObjective(
  id: string,
  payload: { isActive?: boolean; achieved?: number; objective?: number; pct?: number }
): Promise<{ id: string; isActive: boolean }> {
  const res = await fetch(`${API_BASE_URL}/dashboard/terminal-objectives/${id}`, {
    method: 'PATCH',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });
  return handleResponse(res);
}

export interface CreateTerminalAssignmentBody {
  groupType: 'department' | 'person';
  groupTitle: string;
  label?: string;
  sortOrder?: number;
}

export async function createTerminalAssignment(
  objectiveId: string,
  body: CreateTerminalAssignmentBody
): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE_URL}/dashboard/terminal-objectives/${objectiveId}/assignments`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupType: body.groupType,
      groupTitle: body.groupTitle,
      label: body.label ?? body.groupTitle,
      sortOrder: body.sortOrder ?? 0,
    }),
    cache: 'no-store',
  });
  return handleResponse(res);
}

export async function deleteTerminalAssignment(
  objectiveId: string,
  assignmentId: string
): Promise<{ ok: boolean }> {
  const res = await fetch(
    `${API_BASE_URL}/dashboard/terminal-objectives/${objectiveId}/assignments/${assignmentId}`,
    {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
      cache: 'no-store',
    }
  );
  return handleResponse(res);
}
