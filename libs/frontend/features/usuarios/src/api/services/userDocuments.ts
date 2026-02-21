/**
 * @biosstel/usuarios - Documentación de usuario (API users/:userId/documents)
 */

import { API_BASE_URL, getAuthHeaders, handleResponse } from '@biosstel/platform';

export interface UserDocumentItem {
  id: string;
  name: string;
  mimeType?: string;
  createdAt: string;
}

export async function getUserDocuments(userId: string): Promise<UserDocumentItem[]> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/documents`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  return handleResponse<UserDocumentItem[]>(res);
}

export interface UploadDocumentData {
  name: string;
  mimeType?: string;
  contentBase64?: string;
}

export async function uploadUserDocument(userId: string, data: UploadDocumentData): Promise<UserDocumentItem> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/documents`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteUserDocument(userId: string, docId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/documents/${docId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Error al eliminar documento');
}

export async function getUserDocument(userId: string, docId: string): Promise<{ id: string; name: string; mimeType?: string; contentBase64?: string }> {
  const res = await fetch(`${API_BASE_URL}/users/${userId}/documents/${docId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Documento no encontrado');
  return handleResponse(res);
}
