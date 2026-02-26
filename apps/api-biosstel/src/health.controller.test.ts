/**
 * Tests unitarios del HealthController.
 * Asegura que liveness y el resultado del config check tienen la forma esperada.
 * @vitest-environment node
 */
import { vi } from 'vitest';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  const mockHealth = {
    check: vi.fn().mockResolvedValue({ status: 'ok', info: {}, details: {} }),
  };
  const mockDb = { pingCheck: vi.fn().mockResolvedValue({ database: { status: 'up' } }) };
  const mockMemory = { checkHeap: vi.fn().mockResolvedValue({ memory_heap: { status: 'up' } }) };
  const mockDisk = { checkStorage: vi.fn().mockResolvedValue({ disk: { status: 'up' } }) };

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new HealthController(
      mockHealth as unknown as HealthCheckService,
      mockDb as unknown as TypeOrmHealthIndicator,
      mockMemory as unknown as MemoryHealthIndicator,
      mockDisk as unknown as DiskHealthIndicator
    );
  });

  describe('live', () => {
    it('debe devolver { status: "ok" }', () => {
      const result = controller.live();
      expect(result).toEqual({ status: 'ok' });
    });
  });

  describe('ready', () => {
    it('debe llamar a health.check con el indicador de base de datos', async () => {
      await controller.ready();
      expect(mockHealth.check).toHaveBeenCalled();
      const fns = mockHealth.check.mock.calls[0][0];
      expect(Array.isArray(fns)).toBe(true);
      expect(fns).toHaveLength(1);
    });
  });

  describe('check', () => {
    it('debe llamar a health.check con varios indicadores', async () => {
      await controller.check();
      expect(mockHealth.check).toHaveBeenCalled();
      const fns = mockHealth.check.mock.calls[0][0];
      expect(Array.isArray(fns)).toBe(true);
      expect(fns).toHaveLength(3);
    });
  });
});
