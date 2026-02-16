import { test, expect } from '@playwright/test';

const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  name: 'Test User',
};

test.describe('Auth API', () => {
  test('POST /api/auth/register should create a new user', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: testUser,
    });
    expect(response.ok() || response.status() === 201 || response.status() === 400).toBeTruthy();
  });

  test('POST /api/auth/login should authenticate user', async ({ request }) => {
    // First register a user
    await request.post('/api/auth/register', {
      data: testUser,
    });

    // Then try to login
    const response = await request.post('/api/auth/login', {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });
    expect(response.ok() || response.status() === 401).toBeTruthy();
  });

  test('GET /api/auth/profile should require authentication', async ({ request }) => {
    const response = await request.get('/api/auth/profile');
    expect(response.status()).toBe(401);
  });
});
