import type { Fichaje, Tarea } from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export const fichajesService = {
  getFichajes: async (userId: string): Promise<Fichaje[]> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getCurrentFichaje: async (userId: string): Promise<Fichaje | null> => {
    const response = await fetch(
      `${API_BASE_URL}/fichajes/current?userId=${encodeURIComponent(userId)}`,
      { headers: getAuthHeaders() }
    );
    if (response.status === 404) return null;
    if (!response.ok) return null;
    return handleResponse(response);
  },

  clockIn: async (data: { userId: string; location?: { lat: number; lng: number } }): Promise<Fichaje> => {
    const userId = data?.userId == null ? '' : String(data.userId).trim();
    if (userId === '') {
      throw new Error('userId es obligatorio para fichar entrada');
    }
    const body = { userId, location: data?.location };
    const response = await fetch(`${API_BASE_URL}/fichajes/clock-in`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  clockOut: async (fichajeId: string): Promise<Fichaje> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/${fichajeId}/clock-out`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  pause: async (fichajeId: string, reason?: string): Promise<Fichaje> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/${fichajeId}/pause`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
  },

  resume: async (fichajeId: string): Promise<Fichaje> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/${fichajeId}/resume`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTasks: async (userId: string): Promise<Tarea[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/user/${userId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTaskById: async (taskId: string): Promise<Tarea | null> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: getAuthHeaders(),
    });
    if (response.status === 404) return null;
    return handleResponse(response);
  },

  addTask: async (data: {
    userId: string;
    title: string;
    description?: string;
  }): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  updateTask: async (taskId: string, data: Partial<Tarea>): Promise<Tarea> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  deleteTask: async (taskId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Error al eliminar tarea');
    }
  },

  getCalendars: async (): Promise<{ id: string; name: string; description?: string; isDefault?: boolean }[]> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/calendars`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  getSchedules: async (): Promise<{ id: string; name: string; hoursPerYear?: number; vacationDays?: number; freeDisposalDays?: number; hoursPerDayWeekdays?: number; hoursPerDaySaturday?: number; hoursPerWeek?: number }[]> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/schedules`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  getPermissionTypes: async (): Promise<{ id: string; name: string; isPaid?: boolean }[]> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/permission-types`, { headers: getAuthHeaders() });
    return handleResponse(response);
  },

  createCalendar: async (data: { name: string; description?: string }): Promise<{ id: string; name: string }> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/calendars`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  createSchedule: async (data: {
    name: string;
    hoursPerYear?: number;
    vacationDays?: number;
    freeDisposalDays?: number;
    hoursPerDayWeekdays?: number;
    hoursPerDaySaturday?: number;
    hoursPerWeek?: number;
  }): Promise<unknown> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/schedules`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  createPermissionType: async (data: { name: string; isPaid?: boolean }): Promise<unknown> => {
    const response = await fetch(`${API_BASE_URL}/fichajes/permission-types`, {
      method: 'POST',
      headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
