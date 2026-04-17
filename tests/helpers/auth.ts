import { expect, Page } from '@playwright/test';

export async function switchToRegisterMode(page: Page) {
  const registerButton = page.getByRole('button', { name: 'Crear cuenta' });
  if (await registerButton.isVisible().catch(() => false)) {
    await registerButton.click();
  }
}

export async function register(page: Page, email: string, password: string, role: 'professor' | 'student') {
  await page.goto('/auth');
  await switchToRegisterMode(page);
  await page.getByPlaceholder('Tu nombre').fill(role === 'professor' ? 'Profesor' : 'Estudiante');
  await page.getByPlaceholder('Tu apellido').fill('Demo');
  await page.getByPlaceholder('tucorreo@dominio.com').fill(email);
  await page.getByPlaceholder('Contraseña segura').fill(password);
  await page.getByText(role === 'professor' ? 'Profesor' : 'Estudiante', { exact: true }).click();
  await page.getByRole('button', { name: 'Registrarme' }).click();
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth');
  await page.getByPlaceholder('tucorreo@dominio.com').fill(email);
  await page.getByPlaceholder('Contraseña segura').fill(password);
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
}

export async function logout(page: Page) {
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible();
}
