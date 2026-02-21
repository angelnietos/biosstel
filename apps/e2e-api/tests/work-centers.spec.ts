import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe.serial('Work centers API (persistencia en BD)', () => {
  let token: string;
  let createdId: string;
  const nameInicial = 'Barakaldo';
  const nameActualizado = 'Barakaldo Updated';

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    const body = await login.json();
    token = body.access_token;
  });

  test('POST /empresa/work-centers persiste en BD', async ({ request }) => {
    const response = await request.post(`${API}/empresa/work-centers`, {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        name: nameInicial,
        address: 'C/ Ejemplo 1',
        departmentId: 'string',
      },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name', nameInicial);
    createdId = body.id;
  });

  test('persistencia: GET /empresa/work-centers/:id devuelve el centro guardado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/empresa/work-centers/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(createdId);
    expect(body.name).toBe(nameInicial);
    expect(body).toHaveProperty('address', 'C/ Ejemplo 1');
  });

  test('PUT /empresa/work-centers/:id actualiza en BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.put(`${API}/empresa/work-centers/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: nameActualizado, address: 'C/ Ejemplo 2' },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /empresa/work-centers/:id devuelve los datos actualizados', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/empresa/work-centers/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe(nameActualizado);
    expect(body.address).toBe('C/ Ejemplo 2');
  });

  test('DELETE /empresa/work-centers/:id borra de BD', async ({ request }) => {
    if (!createdId) return;
    const response = await request.delete(`${API}/empresa/work-centers/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(204);
  });

  test('persistencia: GET /empresa/work-centers/:id no devuelve el borrado', async ({ request }) => {
    if (!createdId) return;
    const response = await request.get(`${API}/empresa/work-centers/${createdId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toBeNull();
  });
});
