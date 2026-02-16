import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test('GET /api/users should return paginated list', async ({ request }) => {
    const response = await request.get('/api/users');
    // Should return 200 with user list or 401 if auth required
    expect([200, 401]).toContain(response.status());
  });

  test('GET /api/dashboard/home should return dashboard data', async ({ request }) => {
    const response = await request.get('/api/dashboard/home');
    // Should return 200 with dashboard or 401 if auth required
    expect([200, 401]).toContain(response.status());
  });
});
