import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Health API (Swagger-aligned)', () => {
  test('GET /api/v1/health should return 200', async ({ request }) => {
    const response = await request.get(`${API}/health`);
    expect(response.ok()).toBeTruthy();
  });

  test('GET /api/v1/health should return status ok', async ({ request }) => {
    const response = await request.get(`${API}/health`);
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });
});
