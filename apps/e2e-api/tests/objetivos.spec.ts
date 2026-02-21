import { test, expect } from '@playwright/test';

const API = '/api/v1';

test.describe('Objetivos / Dashboard API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const login = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@biosstel.com', password: 'admin123' },
    });
    expect(login.status()).toBe(201);
    token = (await login.json()).access_token;
  });

  test('GET /dashboard/home returns 200 with objectives and alerts', async ({ request }) => {
    const response = await request.get(`${API}/dashboard/home`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('objectives');
    expect(body).toHaveProperty('alerts');
    expect(Array.isArray(body.objectives)).toBe(true);
    expect(Array.isArray(body.alerts)).toBe(true);
  });

  test('GET /dashboard/terminal-objectives returns 200 with header and cards', async ({ request }) => {
    const response = await request.get(`${API}/dashboard/terminal-objectives?type=contratos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('header');
    expect(body).toHaveProperty('departmentCards');
    expect(body).toHaveProperty('peopleCards');
    expect(Array.isArray(body.departmentCards)).toBe(true);
    expect(Array.isArray(body.peopleCards)).toBe(true);
  });

  test('GET /dashboard/terminal-objectives?period=YYYY-MM returns 200', async ({ request }) => {
    const response = await request.get(
      `${API}/dashboard/terminal-objectives?type=puntos&period=2025-08`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('header');
  });

  test('PATCH /dashboard/terminal-objectives/:id with isActive returns 200', async ({
    request,
  }) => {
    const list = await request.get(`${API}/dashboard/terminal-objectives?type=contratos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.status()).toBe(200);
    const data = await list.json();
    const id =
      (data?.header?.id && data.header.id !== '') ? data.header.id : data?.inactiveObjective?.id;
    if (!id) {
      test.skip();
      return;
    }
    const response = await request.patch(`${API}/dashboard/terminal-objectives/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { isActive: true },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('isActive');
  });

  test('PATCH /dashboard/terminal-objectives/:id with objective (meta) returns 200', async ({
    request,
  }) => {
    const list = await request.get(`${API}/dashboard/terminal-objectives?type=contratos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.status()).toBe(200);
    const data = await list.json();
    const id = data?.header?.id && data.header.id !== '' ? data.header.id : data?.inactiveObjective?.id;
    if (!id) {
      test.skip();
      return;
    }
    const response = await request.patch(`${API}/dashboard/terminal-objectives/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { objective: 100 },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('id');
  });

  test('POST /dashboard/terminal-objectives/:id/assignments returns 201 and GET shows card', async ({
    request,
  }) => {
    const list = await request.get(`${API}/dashboard/terminal-objectives?type=contratos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.status()).toBe(200);
    const data = await list.json();
    const id =
      data?.header?.id && data.header.id !== '' ? data.header.id : data?.inactiveObjective?.id;
    if (!id) {
      test.skip();
      return;
    }
    const createRes = await request.post(`${API}/dashboard/terminal-objectives/${id}/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { groupType: 'department', groupTitle: 'Comercial' },
    });
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created).toHaveProperty('id');

    const getRes = await request.get(`${API}/dashboard/terminal-objectives?type=contratos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(getRes.status()).toBe(200);
    const getData = await getRes.json();
    const found = getData?.departmentCards?.some((c: { title: string }) => c.title === 'Comercial');
    expect(found).toBe(true);
  });

  test('DELETE /dashboard/terminal-objectives/:objectiveId/assignments/:assignmentId returns 200', async ({
    request,
  }) => {
    const list = await request.get(`${API}/dashboard/terminal-objectives?type=contratos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.status()).toBe(200);
    const data = await list.json();
    const objectiveId =
      data?.header?.id && data.header.id !== '' ? data.header.id : data?.inactiveObjective?.id;
    const card = data?.departmentCards?.find((c: { title: string }) => c.title === 'Comercial');
    const assignmentId = card?.rows?.[0]?.id;
    if (!objectiveId || !assignmentId) {
      test.skip();
      return;
    }
    const delRes = await request.delete(
      `${API}/dashboard/terminal-objectives/${objectiveId}/assignments/${assignmentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(delRes.status()).toBe(200);
  });
});
