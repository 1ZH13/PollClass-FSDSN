import { Hono } from 'hono';
import Poll from '../models/Poll.ts';
import Vote from '../models/Vote.ts';
import { getUserFromRequest } from '../middleware/auth.ts';

const router = new Hono();

router.post('/:id/vote', async (c) => {
  const user = (await getUserFromRequest(c)) as any;
  if (!user) {
    return c.json({ message: 'No autorizado.' }, 401);
  }

  if (user.role !== 'student') {
    return c.json({ message: 'Solo estudiantes pueden votar.' }, 403);
  }

  const id = c.req.param('id');
  const body = await c.req.json();
  const optionIndex = Number(body.optionIndex);

  if (Number.isNaN(optionIndex)) {
    return c.json({ message: 'optionIndex es requerido.' }, 400);
  }

  const poll = (await Poll.findById(id)) as any;
  if (!poll) {
    return c.json({ message: 'Poll not found.' }, 404);
  }

  if (poll.status === 'closed') {
    return c.json({ message: 'Esta encuesta está cerrada.' }, 400);
  }

  const voterEmail = user.email.toLowerCase();
  const existingVote = await Vote.findOne({ pollId: poll._id, voterEmail });
  if (existingVote) {
    return c.json({ message: 'Ya votaste en esta encuesta.' }, 409);
  }

  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return c.json({ message: 'Opción inválida.' }, 400);
  }

  const vote = new Vote({ pollId: poll._id, optionIndex, voterEmail });
  poll.options[optionIndex].votes += 1;
  await Promise.all([vote.save(), poll.save()]);

  return c.json({ message: 'Voto registrado.' }, 201);
});

router.get('/:id/results', async (c) => {
  const id = c.req.param('id');
  const poll = (await Poll.findById(id).lean()) as any;
  if (!poll) {
    return c.json({ message: 'Poll not found.' }, 404);
  }
  const votes = (await Vote.find({ pollId: poll._id }).sort({ createdAt: -1 }).lean()) as any;
  return c.json({ poll, votes });
});

export default router;
