import { test, expect } from '@playwright/test';
import { API_BASE, uniqueSuffix } from '../helpers/data';

test('API votes: permisos, optionIndex inválido, encuesta cerrada y voto duplicado', async ({ request }) => {
  const id = uniqueSuffix();
  const password = 'Secret123!';
  const professorEmail = `prof-vote-${id}@test.local`;
  const studentEmail = `student-vote-${id}@test.local`;

  const professorRegister = await request.post(`${API_BASE}/auth/register`, {
    data: { email: professorEmail, password, role: 'professor' },
  });
  expect(professorRegister.status()).toBe(201);
  const professorToken = (await professorRegister.json()).token as string;

  const studentRegister = await request.post(`${API_BASE}/auth/register`, {
    data: { email: studentEmail, password, role: 'student' },
  });
  expect(studentRegister.status()).toBe(201);
  const studentToken = (await studentRegister.json()).token as string;

  const createPoll = await request.post(`${API_BASE}/polls`, {
    headers: { Authorization: `Bearer ${professorToken}` },
    data: { title: `Poll voto ${id}`, options: ['A', 'B'] },
  });
  expect(createPoll.status()).toBe(201);
  const pollId = (await createPoll.json())._id as string;

  const professorVote = await request.post(`${API_BASE}/polls/${pollId}/vote`, {
    headers: { Authorization: `Bearer ${professorToken}` },
    data: { optionIndex: 0 },
  });
  expect(professorVote.status()).toBe(403);

  const voteMissingOptionIndex = await request.post(`${API_BASE}/polls/${pollId}/vote`, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: {},
  });
  expect(voteMissingOptionIndex.status()).toBe(400);

  const voteOutOfRange = await request.post(`${API_BASE}/polls/${pollId}/vote`, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: { optionIndex: 99 },
  });
  expect(voteOutOfRange.status()).toBe(400);

  const firstVote = await request.post(`${API_BASE}/polls/${pollId}/vote`, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: { optionIndex: 0 },
  });
  expect(firstVote.status()).toBe(201);

  const duplicateVote = await request.post(`${API_BASE}/polls/${pollId}/vote`, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: { optionIndex: 1 },
  });
  expect(duplicateVote.status()).toBe(409);

  const studentClosePoll = await request.patch(`${API_BASE}/polls/${pollId}/close`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  expect(studentClosePoll.status()).toBe(401);

  const closePoll = await request.patch(`${API_BASE}/polls/${pollId}/close`, {
    headers: { Authorization: `Bearer ${professorToken}` },
  });
  expect(closePoll.status()).toBe(200);

  const voteOnClosedPoll = await request.post(`${API_BASE}/polls/${pollId}/vote`, {
    headers: { Authorization: `Bearer ${studentToken}` },
    data: { optionIndex: 0 },
  });
  expect(voteOnClosedPoll.status()).toBe(400);

  const studentDeletePoll = await request.delete(`${API_BASE}/polls/${pollId}`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  expect(studentDeletePoll.status()).toBe(401);
});
