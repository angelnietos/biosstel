import type {
  Product,
  ProductListResponse,
  CreateProductData,
  UpdateProductData,
} from './models';
import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

const BASE = '/productos';

export async function getProductos(options?: { cacheBust?: boolean }): Promise<ProductListResponse> {
  const url = `${API_BASE_URL}${BASE}${options?.cacheBust ? `?_t=${Date.now()}` : ''}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<ProductListResponse>(res);
}

export async function getProductoById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}${BASE}/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<Product>(res);
}

export async function createProducto(data: CreateProductData): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}${BASE}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Product>(res);
}

export async function updateProducto(id: string, data: UpdateProductData): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}${BASE}/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
    cache: 'no-store',
  });
  return handleResponse<Product>(res);
}

export async function deleteProducto(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}${BASE}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  await handleResponse(res);
}
