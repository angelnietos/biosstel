import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Operaciones API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /operaciones returns 200', async ({ request }) => {
    const response = await request.get(`${API}/operaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeDefined();
  });
});
