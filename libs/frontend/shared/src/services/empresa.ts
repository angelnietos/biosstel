/**
 * @biosstel/shared - API de empresa usada por varias features (evita feature→feature).
 */
import type { Department } from '@biosstel/shared-types';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';
import type { AddDepartmentFormData } from '../types/addDepartmentForm';

export async function createDepartment(data: AddDepartmentFormData): Promise<Department> {
  const res = await fetch(`${API_BASE_URL}/empresa/departments`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Department>(res);
}
