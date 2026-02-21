import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Auth API (Swagger-aligned)', () => {
  test('POST /auth/login returns 201 with access_token, refresh_token and expires_in', async ({ request }) => {
    const response = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('refresh_token');
    expect(body).toHaveProperty('expires_in');
    expect(typeof body.expires_in).toBe('number');
    expect(body).toHaveProperty('user');
  });

  test('POST /auth/login returns 401 for invalid credentials', async ({ request }) => {
    const response = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'wrong' },
    });
    expect(response.status()).toBe(401);
  });

  test('GET /auth/me returns 200 with user when authorized', async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    const { access_token } = await login.json();
    const me = await request.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    expect(me.status()).toBe(200);
    const user = await me.json();
    expect(user).toHaveProperty('email', 'admin@biosstel.com');
  });

  test('POST /auth/refresh returns 200 with new access_token and expires_in', async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    const { refresh_token } = await login.json();
    const response = await request.post(`${API}/auth/refresh`, {
      headers: { 'Content-Type': 'application/json' },
      data: { refresh_token },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('expires_in');
    expect(typeof body.expires_in).toBe('number');
  });

  test('POST /auth/refresh returns 401 for invalid or expired refresh_token', async ({ request }) => {
    const response = await request.post(`${API}/auth/refresh`, {
      headers: { 'Content-Type': 'application/json' },
      data: { refresh_token: 'invalid-token' },
    });
    expect(response.status()).toBe(401);
  });

  test('POST /auth/forgot-password returns 200 with message (mock: same for any email)', async ({
    request,
  }) => {
    const resValid = await request.post(`${API}/auth/forgot-password`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email: 'admin@biosstel.com' },
    });
    expect(resValid.status()).toBe(200);
    const bodyValid = await resValid.json();
    expect(bodyValid).toHaveProperty('message');
    expect(typeof bodyValid.message).toBe('string');

    const resUnknown = await request.post(`${API}/auth/forgot-password`, {
      headers: { 'Content-Type': 'application/json' },
      data: { email: 'unknown@example.com' },
    });
    expect(resUnknown.status()).toBe(200);
    const bodyUnknown = await resUnknown.json();
    expect(bodyUnknown.message).toBe(bodyValid.message);
  });
});

test.describe('Users API', () => {
  test('GET /api/v1/users should return paginated list or 401', async ({ request }) => {
    const response = await request.get(`${API}/users`);
    expect([200, 401]).toContain(response.status());
  });

  test('GET /api/v1/dashboard/home should return dashboard data or 401', async ({ request }) => {
    const response = await request.get(`${API}/dashboard/home`);
    expect([200, 401]).toContain(response.status());
  });
});
