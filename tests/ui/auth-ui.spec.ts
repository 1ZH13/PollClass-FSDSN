import { test, expect } from '@playwright/test';
import { login, logout, register, switchToRegisterMode } from '../helpers/auth';
import { uniqueSuffix } from '../helpers/data';

test('auth UI: bloquea credenciales inválidas y registro duplicado', async ({ page }) => {
  const id = uniqueSuffix();
  const email = `auth-${id}@test.local`;
  const password = 'Secret123!';

  await register(page, email, password, 'student');
  await expect(page).toHaveURL(/\/student/);
  await logout(page);

  await login(page, email, 'WrongPass123');
  await expect(page.getByText('Credenciales inválidas.')).toBeVisible();

  await switchToRegisterMode(page);
  await page.getByPlaceholder('tucorreo@dominio.com').fill(email);
  await page.getByPlaceholder('Contraseña segura').fill(password);
  await page.getByText('Estudiante', { exact: true }).click();
  await page.getByRole('button', { name: 'Registrarme' }).click();
  await expect(page.getByText('El email ya está registrado.')).toBeVisible();

  await login(page, email, password);
  await expect(page).toHaveURL(/\/student/);
});

test('auth UI: validación de campos vacíos en login', async ({ page }) => {
  await page.goto('/auth');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page.getByText('Ingresa email y contraseña.')).toBeVisible();
});
