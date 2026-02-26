/**
 * @biosstel/shared - API de empresa usada por varias features (evita feature→feature).
 */
import type { Department, WorkCenter } from '@biosstel/shared-types';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';
import type { AddDepartmentFormData } from '../types/addDepartmentForm';

export async function getDepartments(): Promise<Department[]> {
  const res = await fetch(`${API_BASE_URL}/empresa/departments`, { headers: getAuthHeaders() });
  return handleResponse<Department[]>(res);
}

export async function getWorkCenters(): Promise<WorkCenter[]> {
  const res = await fetch(`${API_BASE_URL}/empresa/work-centers`, { headers: getAuthHeaders() });
  return handleResponse<WorkCenter[]>(res);
}

export async function createDepartment(data: AddDepartmentFormData): Promise<Department> {
  const res = await fetch(`${API_BASE_URL}/empresa/departments`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Department>(res);
}

export interface UpdateDepartmentData {
  code?: string;
  name?: string;
  color?: string;
  responsibleUserId?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

export async function updateDepartment(
  id: string,
  data: UpdateDepartmentData
): Promise<Department> {
  const res = await fetch(`${API_BASE_URL}/empresa/departments/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Department>(res);
}
