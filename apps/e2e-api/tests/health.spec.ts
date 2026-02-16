import { test, expect } from '@playwright/test';

test.describe('Health API', () => {
  test('GET /api/health should return 200', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
  });

  test('GET /api/health should return status ok', async ({ request }) => {
    const response = await request.get('/api/health');
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('timestamp');
  });
});
