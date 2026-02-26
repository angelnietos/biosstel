import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Fichajes clock-in / current', () => {
  let token: string;
  let userId: string;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    const body = await login.json();
    token = body.access_token;
    userId = body.user?.id;
    if (!userId) {
      const users = await request.get(`${API}/users?page=1&pageSize=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await users.json();
      const items = Array.isArray(data) ? data : (data as { items?: { id: string }[] }).items;
      userId = items?.[0]?.id ?? '';
    }
  });

  test('GET /fichajes/current?userId= returns 200 or 404', async ({ request }) => {
    if (!userId) {
      test.skip();
      return;
    }
    const response = await request.get(`${API}/fichajes/current?userId=${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect([200, 404]).toContain(response.status());
    if (response.status() === 200) {
      const body = await response.json();
      expect(body === null || (body && typeof body.id === 'string')).toBe(true);
    }
  });

  test('POST /fichajes/clock-in with userId returns 200 or 400', async ({ request }) => {
    if (!userId) {
      test.skip();
      return;
    }
    const response = await request.post(`${API}/fichajes/clock-in`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { userId, location: { lat: 40.41, lng: -3.70 } },
    });
    expect([200, 400]).toContain(response.status());
    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('userId', userId);
    }
  });
});
