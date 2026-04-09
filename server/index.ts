import 'dotenv/config';
import { Hono } from 'hono';
import { serve } from 'bun';
import pollsRoutes from './routes/polls.ts';
import votesRoutes from './routes/votes.ts';
import authRoutes from './routes/auth.ts';
import { connectDatabase } from './config/db.ts';

const app = new Hono();

app.use('*', async (c, next) => {
  await next();
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return c;
});

app.options('*', (c) => c.text('OK'));
app.route('/api/auth', authRoutes);
app.route('/api/polls', pollsRoutes);
app.route('/api/polls', votesRoutes);

app.onError((err, c) => {
  console.error(err);
  return c.json({ message: 'Internal server error' }, 500);
});

connectDatabase();

const port = Number(process.env.PORT || 3001);
serve({
  port,
  fetch: app.fetch,
});
