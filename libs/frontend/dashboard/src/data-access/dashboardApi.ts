/**
 * @biosstel/dashboard - API calls
 */

import type {
  DashboardHomeResponse,
  TerminalObjectivesResponse,
} from '@biosstel/shared-types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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

export async function getDashboardHome(filters?: Record<string, string[]>): Promise<DashboardHomeResponse> {
  const res = await fetch(`${API_URL}/api/dashboard/home${buildQuery(filters)}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error cargando dashboard');
  }

  return res.json();
}

export async function getTerminalObjectives(): Promise<TerminalObjectivesResponse> {
  const res = await fetch(`${API_URL}/api/dashboard/terminal-objectives`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error cargando objetivos terminales');
  }

  return res.json();
}

