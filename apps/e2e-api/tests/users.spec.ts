import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Users API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /users returns 200 with items or paginated structure', async ({ request }) => {
    const response = await request.get(`${API}/users?page=1&pageSize=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const items = Array.isArray(body) ? body : (body as { items?: unknown[] }).items;
    expect(Array.isArray(items)).toBe(true);
  });

  test('POST /users returns 201 with user', async ({ request }) => {
    const email = `e2e-${Date.now()}@biosstel.com`;
    const response = await request.post(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { email, password: 'TempPass123!' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email', email);
  });

  test('GET /users/:id returns 200 for existing user', async ({ request }) => {
    const list = await request.get(`${API}/users?page=1&pageSize=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.status()).toBe(200);
    const data = await list.json();
    const items = Array.isArray(data) ? data : (data as { items?: { id: string }[] }).items;
    const id = items?.[0]?.id;
    if (!id) {
      test.skip();
      return;
    }
    const response = await request.get(`${API}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const user = await response.json();
    expect(user).toHaveProperty('id', id);
  });
});
