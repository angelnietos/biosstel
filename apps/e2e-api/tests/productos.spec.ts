import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe.serial('Productos API (persistencia en BD)', () => {
  let token: string;
  let createdId: string;
  const nombreInicial = 'Producto E2E';
  const nombreActualizado = 'Producto E2E Updated';

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /productos returns 200', async ({ request }) => {
    const response = await request.get(`${API}/productos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('products');
    expect(Array.isArray(body.products)).toBe(true);
  });

  test('POST /productos persiste en BD', async ({ request }) => {
    const codigo = `E2E-${Date.now()}`;
    const response = await request.post(`${API}/productos`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { codigo, nombre: nombreInicial, familia: 'Test', estado: 'Activo' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('codigo', codigo);
    expect(body).toHaveProperty('nombre', nombreInicial);
    createdId = body.id;
  });

  test('persistencia: GET /productos/:id devuelve los datos guardados', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/productos/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(createdId);
    expect(body.nombre).toBe(nombreInicial);
    expect(body).toHaveProperty('codigo');
    expect(body).toHaveProperty('familia', 'Test');
  });

  test('PATCH /productos/:id actualiza en BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.patch(`${API}/productos/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { nombre: nombreActualizado },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /productos/:id devuelve los datos actualizados', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/productos/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.nombre).toBe(nombreActualizado);
  });

  test('DELETE /productos/:id borra de BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.delete(`${API}/productos/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /productos/:id devuelve 404 tras borrado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/productos/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(404);
  });

  test('persistencia: listado no contiene el producto borrado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/productos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const found = body.products?.some((p: { id: string }) => p.id === createdId);
    expect(found).toBe(false);
  });
});
