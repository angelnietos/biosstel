/**
 * @biosstel/productos - Unit tests: productos service with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} from './productos';

describe('productos service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getProductos calls GET /productos', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0 }),
    });
    await getProductos();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/productos'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('getProductoById calls GET /productos/:id', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'p1', codigo: 'REF-1', nombre: 'Prod' }),
    });
    await getProductoById('p1');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/productos\/p1$/),
      expect.any(Object)
    );
  });

  it('createProducto sends POST with body', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'p2', codigo: 'REF-2', nombre: 'Nuevo' }),
    });
    await createProducto({ codigo: 'REF-2', nombre: 'Nuevo' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/productos'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ codigo: 'REF-2', nombre: 'Nuevo' }),
      })
    );
  });

  it('updateProducto sends PATCH', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'p1', nombre: 'Updated' }),
    });
    await updateProducto('p1', { nombre: 'Updated' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/productos\/p1$/),
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ nombre: 'Updated' }) })
    );
  });

  it('deleteProducto sends DELETE', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    await deleteProducto('p1');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/productos\/p1$/),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
