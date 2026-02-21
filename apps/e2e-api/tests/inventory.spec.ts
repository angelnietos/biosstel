import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe.serial('Inventory API (persistencia en BD)', () => {
  let token: string;
  let createdId: string;
  const cantidadInicial = 10;
  const cantidadActualizada = 20;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /inventory returns 200', async ({ request }) => {
    const response = await request.get(`${API}/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(Array.isArray(body.items)).toBe(true);
  });

  test('POST /inventory persiste en BD', async ({ request }) => {
    const codigo = `INV-E2E-${Date.now()}`;
    const response = await request.post(`${API}/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { codigo, nombre: 'Item E2E', cantidad: cantidadInicial },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('codigo', codigo);
    expect(body).toHaveProperty('cantidad', cantidadInicial);
    createdId = body.id;
  });

  test('persistencia: GET /inventory/:id devuelve los datos guardados', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/inventory/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(createdId);
    expect(body.cantidad).toBe(cantidadInicial);
    expect(body).toHaveProperty('nombre', 'Item E2E');
  });

  test('PATCH /inventory/:id actualiza en BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.patch(`${API}/inventory/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { cantidad: cantidadActualizada },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /inventory/:id devuelve los datos actualizados', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/inventory/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.cantidad).toBe(cantidadActualizada);
  });

  test('DELETE /inventory/:id borra de BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.delete(`${API}/inventory/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /inventory/:id devuelve 404 tras borrado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/inventory/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(404);
  });

  test('persistencia: listado no contiene el item borrado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const found = body.items?.some((i: { id: string }) => i.id === createdId);
    expect(found).toBe(false);
  });
});
