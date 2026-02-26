import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Alertas API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /alertas returns 200 and array', async ({ request }) => {
    const response = await request.get(`${API}/alertas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('GET /alertas?tipo=ventas returns 200', async ({ request }) => {
    const response = await request.get(`${API}/alertas?tipo=ventas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
  });
});
