/**
 * @biosstel/inventory - Unit tests: inventory service with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getInventory,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from './inventory';

describe('inventory service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getInventory calls GET /inventory', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [], total: 0 }),
    });
    await getInventory();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/inventory'),
      expect.objectContaining({ method: 'GET' })
    );
  });

  it('getInventoryItemById calls GET /inventory/:id', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'i1', codigo: 'INV-1', nombre: 'Item', cantidad: 10 }),
    });
    await getInventoryItemById('i1');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/inventory\/i1$/),
      expect.any(Object)
    );
  });

  it('createInventoryItem sends POST with body', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'i2', codigo: 'INV-2', nombre: 'Nuevo', cantidad: 0 }),
    });
    await createInventoryItem({ codigo: 'INV-2', nombre: 'Nuevo', cantidad: 0 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/inventory'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ codigo: 'INV-2', nombre: 'Nuevo', cantidad: 0 }),
      })
    );
  });

  it('updateInventoryItem sends PATCH', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'i1', cantidad: 20 }),
    });
    await updateInventoryItem('i1', { cantidad: 20 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/inventory\/i1$/),
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ cantidad: 20 }) })
    );
  });

  it('deleteInventoryItem sends DELETE', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    await deleteInventoryItem('i1');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/inventory\/i1$/),
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
