import { Hono } from 'hono';
// @ts-ignore: bcryptjs types may not be installed in this workspace
import bcrypt from 'bcryptjs';
import User from '../models/User.ts';

const router = new Hono();

router.post('/register', async (c) => {
  const body = await c.req.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  const role = body.role === 'professor' ? 'professor' : 'student';

  if (!email || !password || !body.role) {
    return c.json({ message: 'Email, contraseña y rol son requeridos.' }, 400);
  }

  const existing = (await User.findOne({ email })) as any;
  if (existing) {
    return c.json({ message: 'El email ya está registrado.' }, 409);
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const token = crypto.randomUUID();

  const user = new User({ email, passwordHash, role, token });
  await user.save();

  return c.json({ user: { email: user.email, role: user.role }, token });
});

router.post('/login', async (c) => {
  const body = await c.req.json();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return c.json({ message: 'Email y contraseña son requeridos.' }, 400);
  }

  const user = (await User.findOne({ email })) as any;
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return c.json({ message: 'Credenciales inválidas.' }, 401);
  }

  if (!user.token) {
    user.token = crypto.randomUUID();
    await user.save();
  }

  return c.json({ user: { email: user.email, role: user.role }, token: user.token });
});

router.get('/me', async (c) => {
  const authorization = c.req.header('Authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) {
    return c.json({ message: 'No autorizado.' }, 401);
  }

  const user = (await User.findOne({ token }).lean()) as any;
  if (!user) {
    return c.json({ message: 'No autorizado.' }, 401);
  }

  return c.json({ user: { email: user.email, role: user.role } });
});

export default router;
