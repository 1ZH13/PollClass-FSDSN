import { test, expect } from '@playwright/test';
import { logout, register } from '../helpers/auth';
import { uniqueSuffix } from '../helpers/data';

test('UI: guardas de rol bloquean panel incorrecto', async ({ page }) => {
  const id = uniqueSuffix();
  const password = 'Secret123!';

  await register(page, `prof-guard-${id}@test.local`, password, 'professor');
  await expect(page).toHaveURL(/\/professor/);
  await page.goto('/student');
  await expect(page.getByText('Acceso no autorizado')).toBeVisible();
  await logout(page);

  await register(page, `student-guard-${id}@test.local`, password, 'student');
  await expect(page).toHaveURL(/\/student/);
  await page.goto('/professor');
  await expect(page.getByText('Acceso no autorizado')).toBeVisible();
});

test('UI: acceso sin sesión en profesor y estudiante pide autenticación', async ({ page }) => {
  await page.goto('/professor');
  await expect(page.getByText('Necesitas iniciar sesión')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ir a autenticación' })).toBeVisible();

  await page.goto('/student');
  await expect(page.getByText('Necesitas iniciar sesión')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ir a autenticación' })).toBeVisible();
});
