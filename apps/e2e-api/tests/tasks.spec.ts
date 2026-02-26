import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe.serial('Tasks API (persistencia en BD)', () => {
  let token: string;
  let userId: string;
  let taskId: string;
  const titleInicial = 'E2E Task';

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    const loginBody = await login.json();
    token = loginBody.access_token;
    userId = loginBody.user?.id;
    if (!userId) {
      const users = await request.get(`${API}/users?page=1&pageSize=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersBody = await users.json();
      const items = Array.isArray(usersBody) ? usersBody : (usersBody as { items?: { id: string }[] }).items;
      userId = items?.[0]?.id ?? '';
    }
  });

  test('GET /tasks/user/:userId returns 200 and array', async ({ request }) => {
    if (!userId) {
      test.skip();
      return;
    }
    const response = await request.get(`${API}/tasks/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /tasks persiste en BD', async ({ request }) => {
    if (!userId) {
      test.skip();
      return;
    }
    const response = await request.post(`${API}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { userId, title: titleInicial, description: 'Created by E2E' },
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title', titleInicial);
    taskId = body.id;
  });

  test('persistencia: GET /tasks/:taskId devuelve la tarea guardada', async ({ request }) => {
    if (!taskId) return;
    const response = await request.get(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(taskId);
    expect(body.title).toBe(titleInicial);
    expect(body.completed).toBe(false);
  });

  test('PATCH /tasks/:taskId actualiza en BD', async ({ request }) => {
    if (!taskId) return;
    const response = await request.patch(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { completed: true },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /tasks/:taskId devuelve completed true', async ({ request }) => {
    if (!taskId) return;
    const response = await request.get(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.completed).toBe(true);
  });

  test('DELETE /tasks/:taskId borra de BD', async ({ request }) => {
    if (!taskId) return;
    const response = await request.delete(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
  });

  test('persistencia: GET /tasks/:taskId devuelve 404 tras borrado', async ({ request }) => {
    if (!taskId) return;
    const response = await request.get(`${API}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(404);
  });

  test('persistencia: listado del usuario no contiene la tarea borrada', async ({ request }) => {
    if (!taskId || !userId) return;
    const response = await request.get(`${API}/tasks/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const found = Array.isArray(body) && body.some((t: { id: string }) => t.id === taskId);
    expect(found).toBe(false);
  });
});
