/**
 * Utilidad de paginación para respuestas de listados.
 * Usar desde use cases o servicios que devuelven listas paginadas.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));
  const start = (safePage - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  return {
    data,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}
