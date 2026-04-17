import { test, expect } from '@playwright/test';
import { API_BASE, uniqueSuffix } from '../helpers/data';

test('API polls: endpoints críticos protegidos por auth y rol', async ({ request }) => {
  const id = uniqueSuffix();
  const password = 'Secret123!';
  const studentEmail = `student-api-${id}@test.local`;
  const professorEmail = `prof-api-${id}@test.local`;

  const unauthCreatePoll = await request.post(`${API_BASE}/polls`, {
    data: { title: `Sin token ${id}`, options: ['A', 'B'] },
  });
  expect(unauthCreatePoll.status()).toBe(401);

  const studentRegister = await request.post(`${API_BASE}/auth/register`, {
    data: { email: studentEmail, password, role: 'student', firstName: 'Student', lastName: 'API' },
  });
  expect(studentRegister.status()).toBe(201);
  const studentToken = (await studentRegister.json()).token as string;

  const studentCreatePoll = await request.post(`${API_BASE}/polls`, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: { title: `No permitido ${id}`, options: ['A', 'B'] },
  });
  expect(studentCreatePoll.status()).toBe(401);

  const professorRegister = await request.post(`${API_BASE}/auth/register`, {
    data: { email: professorEmail, password, role: 'professor', firstName: 'Professor', lastName: 'API' },
  });
  expect(professorRegister.status()).toBe(201);
});

test('API polls: ids inválidos y acciones sobre recursos inexistentes', async ({ request }) => {
  const id = uniqueSuffix();
  const password = 'Secret123!';
  const professorEmail = `prof-id-${id}@test.local`;

  const professorRegister = await request.post(`${API_BASE}/auth/register`, {
    data: { email: professorEmail, password, role: 'professor', firstName: 'Professor', lastName: 'IDs' },
  });
  expect(professorRegister.status()).toBe(201);
  const professorToken = (await professorRegister.json()).token as string;

  const getInvalidId = await request.get(`${API_BASE}/polls/not-an-object-id`);
  expect(getInvalidId.status()).toBe(404);

  const resultsInvalidId = await request.get(`${API_BASE}/polls/not-an-object-id/results`);
  expect(resultsInvalidId.status()).toBe(404);

  const closeInvalidId = await request.patch(`${API_BASE}/polls/not-an-object-id/close`, {
    headers: { Authorization: `Bearer ${professorToken}` },
  });
  expect(closeInvalidId.status()).toBe(404);

  const deleteInvalidId = await request.delete(`${API_BASE}/polls/not-an-object-id`, {
    headers: { Authorization: `Bearer ${professorToken}` },
  });
  expect(deleteInvalidId.status()).toBe(404);
});

test('API polls: cada profesor solo ve sus encuestas', async ({ request }) => {
  const id = uniqueSuffix();
  const password = 'Secret123!';

  const professorARegister = await request.post(`${API_BASE}/auth/register`, {
    data: { email: `prof-a-${id}@test.local`, password, role: 'professor', firstName: 'A', lastName: 'Owner' },
  });
  expect(professorARegister.status()).toBe(201);
  const professorAToken = (await professorARegister.json()).token as string;

  const professorBRegister = await request.post(`${API_BASE}/auth/register`, {
    data: { email: `prof-b-${id}@test.local`, password, role: 'professor', firstName: 'B', lastName: 'Owner' },
  });
  expect(professorBRegister.status()).toBe(201);
  const professorBToken = (await professorBRegister.json()).token as string;

  const createPollA = await request.post(`${API_BASE}/polls`, {
    headers: { Authorization: `Bearer ${professorAToken}` },
    data: { title: `Poll A ${id}`, options: ['A1', 'A2'] },
  });
  expect(createPollA.status()).toBe(201);

  const createPollB = await request.post(`${API_BASE}/polls`, {
    headers: { Authorization: `Bearer ${professorBToken}` },
    data: { title: `Poll B ${id}`, options: ['B1', 'B2'] },
  });
  expect(createPollB.status()).toBe(201);

  const listA = await request.get(`${API_BASE}/polls`, {
    headers: { Authorization: `Bearer ${professorAToken}` },
  });
  expect(listA.status()).toBe(200);
  const pollsA = await listA.json();
  expect(pollsA.some((poll: any) => String(poll.title).includes(`Poll A ${id}`))).toBeTruthy();
  expect(pollsA.some((poll: any) => String(poll.title).includes(`Poll B ${id}`))).toBeFalsy();
});
