/**
 * @biosstel/empresa - Empresa API (departamentos, centros, cuentas)
 */

import type { EmpresaListResponse, Department, WorkCenter } from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export { createDepartment } from '@biosstel/shared';
export type { AddDepartmentFormData as CreateDepartmentData } from '@biosstel/shared';

export async function getEmpresa(): Promise<EmpresaListResponse> {
  const res = await fetch(`${API_BASE_URL}/empresa`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<EmpresaListResponse>(res);
}

export async function createWorkCenter(data: { name: string; address?: string; departmentId?: string }): Promise<WorkCenter> {
  const res = await fetch(`${API_BASE_URL}/empresa/work-centers`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<WorkCenter>(res);
}

export async function updateWorkCenter(
  id: string,
  data: { name?: string; address?: string; departmentId?: string }
): Promise<WorkCenter> {
  const res = await fetch(`${API_BASE_URL}/empresa/work-centers/${id}`, {
    method: 'PUT',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<WorkCenter>(res);
}
