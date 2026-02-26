/**
 * Shared types and pure helpers for FichajeDashboard and its subcomponents.
 */

import { StatusBadge } from '@biosstel/ui';

export const HOURS_OBJETIVO = 2400;

export interface ScheduleItem {
  id: string;
  name: string;
  hoursPerYear?: number;
  vacationDays?: number;
  freeDisposalDays?: number;
  hoursPerDayWeekdays?: number;
  hoursPerDaySaturday?: number;
  hoursPerWeek?: number;
}

export interface DashboardRow {
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  startTime: string | null;
  location: { lat: number; lng: number } | null;
  minutosHoy: number;
}

/** Format minutes as "X hrs Y min" without nested template literals (Sonar S4624). */
export function formatMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const minPart = m > 0 ? ' ' + m + ' min' : '';
  return h + ' hrs' + minPart;
}

export function formatTime(iso: string | null): string {
  if (!iso) return '-';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function pct(min: number, objetivo = HOURS_OBJETIVO): number {
  return Math.min(Math.round((min / objetivo) * 100), 110);
}

export function getRoleVariant(role: string): 'info' | 'purple' | 'warning' | 'default' {
  switch (role?.toLowerCase()) {
    case 'comercial':
      return 'info';
    case 'telemarketing':
      return 'warning';
    case 'tienda':
      return 'purple';
    default:
      return 'default';
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'working':
      return <StatusBadge label="Fichado" status="success" />;
    case 'paused':
      return <StatusBadge label="Pausado" status="warning" />;
    case 'finished':
      return <StatusBadge label="Finalizado" status="muted" />;
    default:
      return <StatusBadge label="Sin fichar" status="error" />;
  }
}

export function getProgressVariant(value: number): 'default' | 'success' | 'error' {
  if (value > 100) return 'error';
  if (value > 70) return 'success';
  return 'default';
}

/** Extract arc variant from fichaje state (avoids nested ternary S3358). */
export function getClockArcVariant(state: string): 'green' | 'red' | 'gray' {
  if (state === 'working') return 'green';
  if (state === 'paused') return 'red';
  return 'gray';
}

/** Extract arc progress from fichaje state. */
export function getClockArcProgress(state: string): number {
  if (state === 'working') return 50;
  if (state === 'paused') return 25;
  return 0;
}

/** Stable keys for skeleton rows to avoid array index as key (S6479). */
export const SKELETON_ROW_IDS = {
  fichajes: ['sk-fichajes-1', 'sk-fichajes-2', 'sk-fichajes-3', 'sk-fichajes-4', 'sk-fichajes-5', 'sk-fichajes-6'] as const,
  calendarios: ['sk-cal-1', 'sk-cal-2', 'sk-cal-3'] as const,
  horarios: ['sk-hor-1', 'sk-hor-2', 'sk-hor-3'] as const,
  permisos: ['sk-perm-1', 'sk-perm-2', 'sk-perm-3'] as const,
};

export const SKELETON_CELL_IDS = {
  fichajes: ['sk-fc-1', 'sk-fc-2', 'sk-fc-3', 'sk-fc-4', 'sk-fc-5', 'sk-fc-6', 'sk-fc-7', 'sk-fc-8'] as const,
  horarios: ['sk-hc-1', 'sk-hc-2', 'sk-hc-3', 'sk-hc-4', 'sk-hc-5', 'sk-hc-6', 'sk-hc-7'] as const,
};
