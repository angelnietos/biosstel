import { describe, it, expect, beforeEach } from 'vitest';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status', () => {
    const result = controller.check();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('timestamp');
  });

  it('should return "ok" status', () => {
    const result = controller.check();
    expect(result.status).toBe('ok');
  });
});
