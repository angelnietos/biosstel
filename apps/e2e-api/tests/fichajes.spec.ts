import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Fichajes API (Swagger-aligned)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    const body = await login.json();
    token = body.access_token;
  });

  test('GET /fichajes without date query (optional) returns 200', async ({ request }) => {
    const response = await request.get(`${API}/fichajes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /fichajes?date=2026-02-20 returns 200', async ({ request }) => {
    const response = await request.get(`${API}/fichajes?date=2026-02-20`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
  });
});
