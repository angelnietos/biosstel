/**
 * @biosstel/objetivos - Unit tests: dashboard service (getTerminalObjectives, patchTerminalObjective) with mocked fetch
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  getTerminalObjectives,
  patchTerminalObjective,
  createTerminalAssignment,
  deleteTerminalAssignment,
} from './dashboard';

describe('dashboard service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('getTerminalObjectives', () => {
    it('calls GET with type and optional period in query', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            header: { id: 'h1', title: 'Objetivos', achieved: 0, objective: 100, pct: 0, rangeLabel: '' },
            departmentCards: [],
            peopleCards: [],
          }),
      });

      await getTerminalObjectives({ type: ['puntos'], period: ['2026-01'] });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/dashboard/terminal-objectives'),
        expect.any(Object)
      );
      const url = (fetch as any).mock.calls[0][0];
      expect(url).toMatch(/type=puntos/);
      expect(url).toMatch(/period=2026-01/);
    });
  });

  describe('patchTerminalObjective', () => {
    it('sends PATCH with isActive in body', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'obj-1', isActive: true }),
      });

      const result = await patchTerminalObjective('obj-1', { isActive: true });

      expect(result).toEqual({ id: 'obj-1', isActive: true });
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/dashboard\/terminal-objectives\/obj-1$/),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ isActive: true }),
        })
      );
    });

    it('sends PATCH with objective (meta) in body', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'obj-1', isActive: true }),
      });

      await patchTerminalObjective('obj-1', { objective: 50 });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/dashboard\/terminal-objectives\/obj-1$/),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ objective: 50 }),
        })
      );
    });
  });

  describe('createTerminalAssignment', () => {
    it('sends POST with groupType and groupTitle', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: 'assign-1' }),
      });

      await createTerminalAssignment('obj-1', {
        groupType: 'department',
        groupTitle: 'Comercial',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/dashboard\/terminal-objectives\/obj-1\/assignments$/),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            groupType: 'department',
            groupTitle: 'Comercial',
            label: 'Comercial',
            sortOrder: 0,
          }),
        })
      );
    });
  });

  describe('deleteTerminalAssignment', () => {
    it('sends DELETE to assignment URL', async () => {
      (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true }),
      });

      await deleteTerminalAssignment('obj-1', 'assign-1');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/dashboard\/terminal-objectives\/obj-1\/assignments\/assign-1$/),
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });
});
