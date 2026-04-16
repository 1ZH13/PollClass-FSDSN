import { test, expect } from '@playwright/test';
import { logout, register } from '../helpers/auth';
import { uniqueSuffix } from '../helpers/data';

test('UI completo: auth, crear encuesta, votar, cerrar y eliminar', async ({ browser }) => {
  const id = uniqueSuffix();
  const professorEmail = `prof-${id}@test.local`;
  const studentEmail = `student-${id}@test.local`;
  const password = 'Secret123!';

  const professorContext = await browser.newContext();
  const professorPage = await professorContext.newPage();

  await register(professorPage, professorEmail, password, 'professor');
  await expect(professorPage).toHaveURL(/\/professor/);
  await expect(professorPage.getByRole('heading', { name: 'Panel de Profesor' })).toBeVisible();

  const pollTitle = `Encuesta E2E ${id}`;
  await professorPage.getByPlaceholder('¿Qué tema prefieres?').fill(pollTitle);
  await professorPage.getByPlaceholder('Opción 1').fill('React');
  await professorPage.getByPlaceholder('Opción 2').fill('Vue');

  const createResponsePromise = professorPage.waitForResponse((response) =>
    response.url().includes('/api/polls') && response.request().method() === 'POST'
  );
  await professorPage.getByRole('button', { name: 'Crear encuesta' }).click();
  const createdPoll = await (await createResponsePromise).json();
  const pollId = String(createdPoll._id || '');
  const pollCode = String(createdPoll.code || '');
  expect(pollId).toBeTruthy();
  expect(pollCode).toMatch(/^[A-Z0-9]{6}$/);

  await professorPage.locator(`a[href='/professor/poll/${pollId}']`).click();
  await expect(professorPage).toHaveURL(/\/professor\/poll\//);
  await expect(professorPage.getByRole('heading', { name: pollTitle })).toBeVisible();

  const studentContext = await browser.newContext();
  const studentPage = await studentContext.newPage();
  await register(studentPage, studentEmail, password, 'student');

  await studentPage.getByPlaceholder('Ej: ABC123').fill(pollCode);
  await studentPage.getByRole('button', { name: 'Unirme' }).click();
  await expect(studentPage.getByText(pollTitle)).toBeVisible();

  await studentPage.getByRole('button', { name: 'React' }).click();
  await expect(studentPage.getByRole('heading', { name: 'Resultados oficiales' })).toBeVisible();

  await studentPage.getByRole('button', { name: 'Volver a código' }).click();
  await studentPage.getByPlaceholder('Ej: ABC123').fill(pollCode);
  await studentPage.getByRole('button', { name: 'Unirme' }).click();
  await studentPage.getByRole('button', { name: 'Vue' }).click();
  await expect(studentPage.getByText('Ya votaste en esta encuesta.')).toBeVisible();

  await professorPage.getByRole('button', { name: 'Cerrar encuesta' }).click();
  await expect(professorPage.getByText('Cerrada')).toBeVisible();

  await studentPage.goto('/student');
  await studentPage.getByPlaceholder('Ej: ABC123').fill(pollCode);
  await studentPage.getByRole('button', { name: 'Unirme' }).click();
  await expect(studentPage.getByText('Encuesta no encontrada o cerrada.')).toBeVisible();

  await professorPage.goto('/professor');
  const pollCardForDelete = professorPage.locator(`xpath=//a[@href='/professor/poll/${pollId}']/ancestor::div[contains(@class,'shadow-lg')][1]`);
  await expect(pollCardForDelete).toBeVisible();
  professorPage.once('dialog', (dialog) => dialog.accept());
  await pollCardForDelete.getByRole('button', { name: 'Eliminar' }).click();
  await expect(professorPage.locator(`a[href='/professor/poll/${pollId}']`)).toHaveCount(0);

  await logout(professorPage);
  await logout(studentPage);

  await studentContext.close();
  await professorContext.close();
});

test('UI profesor/estudiante: validación de encuesta y código inválido', async ({ browser }) => {
  const id = uniqueSuffix();
  const password = 'Secret123!';

  const professorContext = await browser.newContext();
  const professorPage = await professorContext.newPage();
  await register(professorPage, `prof-val-${id}@test.local`, password, 'professor');

  await professorPage.getByPlaceholder('¿Qué tema prefieres?').fill(`Encuesta validación ${id}`);
  await professorPage.getByPlaceholder('Opción 1').fill('Solo una opción');
  await professorPage.getByPlaceholder('Opción 2').fill('   ');
  await professorPage.getByRole('button', { name: 'Crear encuesta' }).click();
  await expect(professorPage.getByText('Ingresa un título y al menos dos opciones.')).toBeVisible();

  const createResponsePromise = professorPage.waitForResponse((response) =>
    response.url().includes('/api/polls') && response.request().method() === 'POST'
  );
  await professorPage.getByPlaceholder('Opción 2').fill('Segunda opción válida');
  await professorPage.getByRole('button', { name: 'Crear encuesta' }).click();
  const createdPoll = await (await createResponsePromise).json();
  const pollCode = String(createdPoll.code || '');
  expect(pollCode).toMatch(/^[A-Z0-9]{6}$/);

  const studentContext = await browser.newContext();
  const studentPage = await studentContext.newPage();
  await register(studentPage, `student-val-${id}@test.local`, password, 'student');

  await studentPage.getByPlaceholder('Ej: ABC123').fill('ZZZZZZ');
  await studentPage.getByRole('button', { name: 'Unirme' }).click();
  await expect(studentPage.getByText('Encuesta no encontrada o cerrada.')).toBeVisible();

  await studentPage.getByPlaceholder('Ej: ABC123').fill(pollCode);
  await studentPage.getByRole('button', { name: 'Unirme' }).click();
  await expect(studentPage.getByText(`Encuesta validación ${id}`)).toBeVisible();

  await studentContext.close();
  await professorContext.close();
});
