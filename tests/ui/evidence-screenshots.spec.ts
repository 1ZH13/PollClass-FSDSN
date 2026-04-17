import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { register } from '../helpers/auth';
import { uniqueSuffix } from '../helpers/data';

const SHOTS_DIR = 'docs/screenshots';

test('captura evidencia: landing, profesor y estudiante', async ({ browser, page }) => {
  await mkdir(SHOTS_DIR, { recursive: true });

  await page.goto('/');
  await expect(page.getByText('PollClass, el aula cristalina.')).toBeVisible();
  await page.screenshot({
    path: `${SHOTS_DIR}/01-landing.png`,
    fullPage: true,
  });

  const id = uniqueSuffix();
  const password = 'Secret123!';
  const professorEmail = `prof-evidence-${id}@test.local`;
  const studentEmail = `student-evidence-${id}@test.local`;

  const professorContext = await browser.newContext();
  const professorPage = await professorContext.newPage();
  await register(professorPage, professorEmail, password, 'professor');
  await expect(professorPage).toHaveURL(/\/professor/);
  await expect(professorPage.getByRole('heading', { name: 'Panel de Profesor' })).toBeVisible();
  await professorPage.screenshot({
    path: `${SHOTS_DIR}/02-vista-profesor.png`,
    fullPage: true,
  });

  const studentContext = await browser.newContext();
  const studentPage = await studentContext.newPage();
  await register(studentPage, studentEmail, password, 'student');
  await expect(studentPage).toHaveURL(/\/student/);
  await expect(studentPage.getByRole('heading', { name: 'Vista Estudiante' })).toBeVisible();
  await studentPage.screenshot({
    path: `${SHOTS_DIR}/03-vista-estudiante.png`,
    fullPage: true,
  });

  await studentContext.close();
  await professorContext.close();
});