import type {
  InventoryItem,
  InventoryListResponse,
  CreateInventoryData,
  UpdateInventoryData,
} from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

const BASE = '/inventory';

export async function getInventory(): Promise<InventoryListResponse> {
  const res = await fetch(`${API_BASE_URL}${BASE}`, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<InventoryListResponse>(res);
}

export async function getInventoryItemById(id: string): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE_URL}${BASE}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<InventoryItem>(res);
}

export async function createInventoryItem(data: CreateInventoryData): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE_URL}${BASE}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<InventoryItem>(res);
}

export async function updateInventoryItem(
  id: string,
  data: UpdateInventoryData
): Promise<InventoryItem> {
  const res = await fetch(`${API_BASE_URL}${BASE}/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<InventoryItem>(res);
}

export async function deleteInventoryItem(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleResponse(res);
}
