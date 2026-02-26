import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe.serial('Clients API (persistencia en BD)', () => {
  let token: string;
  let createdId: string;
  let clientEmail: string;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /clients returns 200 and array', async ({ request }) => {
    const response = await request.get(`${API}/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /clients persiste en BD', async ({ request }) => {
    clientEmail = `client-e2e-${Date.now()}@example.com`;
    const response = await request.post(`${API}/clients`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: 'E2E Client', email: clientEmail, phone: '+34 600 000 000' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('email', clientEmail);
    expect(body).toHaveProperty('name', 'E2E Client');
    createdId = body.id;
  });

  test('persistencia: listado contiene el cliente creado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/clients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const found = Array.isArray(body) && body.find((c: { id: string }) => c.id === createdId);
    expect(found).toBeTruthy();
    expect(found.email).toBe(clientEmail);
    expect(found.name).toBe('E2E Client');
  });
});
