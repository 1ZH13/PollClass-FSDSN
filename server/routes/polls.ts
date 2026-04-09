import { Hono } from 'hono';
import Poll from '../models/Poll.ts';
import { getUserFromRequest } from '../middleware/auth.ts';

const router = new Hono();

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function createUniqueCode() {
  let code = generateCode();
  while (await Poll.findOne({ code })) {
    code = generateCode();
  }
  return code;
}

router.get('/', async (c) => {
  const polls = await Poll.find().sort({ createdAt: -1 }).lean();
  return c.json(polls);
});

router.post('/', async (c) => {
  const user = await getUserFromRequest(c);
  if (!user || user.role !== 'professor') {
    return c.json({ message: 'No autorizado.' }, 401);
  }

  const body = await c.req.json();
  const title = String(body.title || '').trim();
  const options = Array.isArray(body.options) ? body.options.map((text: unknown) => String(text).trim()).filter((text: string) => Boolean(text)) : [];

  if (!title || options.length < 2) {
    return c.json({ message: 'Title and at least 2 options are required.' }, 400);
  }

  const poll = new Poll({
    title,
    options: options.map((text: string) => ({ text, votes: 0 })),
    code: await createUniqueCode(),
  });

  await poll.save();
  return c.json(poll, 201);
});

router.get('/:id', async (c) => {
  const id = c.req.param('id');
  const poll = await Poll.findById(id).lean();
  if (!poll) {
    return c.json({ message: 'Poll not found.' }, 404);
  }
  return c.json(poll);
});

router.get('/code/:code', async (c) => {
  const code = c.req.param('code');
  const poll = await Poll.findOne({ code: code.toUpperCase(), status: 'active' }).lean();
  if (!poll) {
    return c.json({ message: 'Encuesta no encontrada o cerrada.' }, 404);
  }
  return c.json(poll);
});

router.patch('/:id/close', async (c) => {
  const user = await getUserFromRequest(c);
  if (!user || user.role !== 'professor') {
    return c.json({ message: 'No autorizado.' }, 401);
  }

  const id = c.req.param('id');
  const poll = await Poll.findByIdAndUpdate(id, { status: 'closed', closedAt: new Date() }, { new: true }).lean();
  if (!poll) {
    return c.json({ message: 'Poll not found.' }, 404);
  }
  return c.json(poll);
});

router.delete('/:id', async (c) => {
  const user = await getUserFromRequest(c);
  if (!user || user.role !== 'professor') {
    return c.json({ message: 'No autorizado.' }, 401);
  }

  const id = c.req.param('id');
  const poll = await Poll.findByIdAndDelete(id).lean();
  if (!poll) {
    return c.json({ message: 'Poll not found.' }, 404);
  }
  return c.json({ message: 'Poll deleted.' });
});

export default router;
