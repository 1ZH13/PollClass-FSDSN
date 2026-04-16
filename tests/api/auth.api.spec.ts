import { test, expect } from '@playwright/test';
import { API_BASE } from '../helpers/data';

test('API auth: validaciones y token inválido en /auth/me', async ({ request }) => {
  const registerMissingRole = await request.post(`${API_BASE}/auth/register`, {
    data: { email: 'missing-role@test.local', password: 'Secret123!' },
  });
  expect(registerMissingRole.status()).toBe(400);

  const loginMissingPassword = await request.post(`${API_BASE}/auth/login`, {
    data: { email: 'x@test.local' },
  });
  expect(loginMissingPassword.status()).toBe(400);

  const meWithoutToken = await request.get(`${API_BASE}/auth/me`);
  expect(meWithoutToken.status()).toBe(401);

  const meWithInvalidToken = await request.get(`${API_BASE}/auth/me`, {
    headers: { Authorization: 'Bearer invalid-token' },
  });
  expect(meWithInvalidToken.status()).toBe(401);
});
