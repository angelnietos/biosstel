import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe.serial('Departments API (persistencia en BD)', () => {
  let token: string;
  let createdId: string;
  const nameInicial = 'E2E Dept';
  const nameActualizado = 'E2E Dept Updated';

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /empresa/departments returns 200 and array', async ({ request }) => {
    const response = await request.get(`${API}/empresa/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /empresa/departments persiste en BD', async ({ request }) => {
    const response = await request.post(`${API}/empresa/departments`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: nameInicial, code: 'E2E-01' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', nameInicial);
    createdId = body.id;
  });

  test('persistencia: GET /empresa/departments/:id devuelve el departamento guardado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/empresa/departments/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).not.toBeNull();
    expect(body.id).toBe(createdId);
    expect(body.name).toBe(nameInicial);
  });

  test('PUT /empresa/departments/:id actualiza en BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.put(`${API}/empresa/departments/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: nameActualizado },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /empresa/departments/:id devuelve los datos actualizados', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/empresa/departments/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).not.toBeNull();
    expect(body.name).toBe(nameActualizado);
  });

  test('DELETE /empresa/departments/:id borra de BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.delete(`${API}/empresa/departments/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(204);
  });

  test('persistencia: GET /empresa/departments/:id no devuelve el borrado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/empresa/departments/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeNull();
  });

  test('persistencia: listado no contiene el departamento borrado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/empresa/departments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const found = Array.isArray(body) && body.some((d: { id: string }) => d.id === createdId);
    expect(found).toBe(false);
  });
});
