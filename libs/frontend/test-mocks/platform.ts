/**
 * Stub for @biosstel/platform in feature tests (avoids Next.js / DOM deps)
 */
export const API_BASE_URL = 'http://test.api/v1';
export const getAuthHeaders = (): Record<string, string> => ({ 'Content-Type': 'application/json' });
export async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error('Request failed');
  return res.json() as Promise<T>;
}
