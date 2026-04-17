import bcrypt from 'bcryptjs';
import { users } from '../config/db.ts';
import { getUserFromRequest } from '../middleware/auth.ts';
import { jsonResponse, parseJson } from '../utils.ts';

export async function authHandler(req) {
  const url = new URL(req.url);
  const path = url.pathname;

  function buildDisplayName(firstName, lastName, email) {
    const first = String(firstName || '').trim();
    const last = String(lastName || '').trim();
    const full = `${first} ${last}`.trim();
    if (full) {
      return { firstName: first, lastName: last, fullName: full };
    }

    const fallback = String(email || '').split('@')[0] || '';
    return { firstName: first, lastName: last, fullName: fallback };
  }

  if (req.method === 'POST' && path === '/api/auth/register') {
    const body = await parseJson(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = body.role === 'professor' ? 'professor' : 'student';
    const firstName = String(body.firstName || '').trim();
    const lastName = String(body.lastName || '').trim();

    if (!email || !password || !body.role || !firstName || !lastName) {
      return jsonResponse({ message: 'Nombre, apellido, email, contraseña y rol son requeridos.' }, 400);
    }

    const existing = await users.findOne({ email });
    if (existing) {
      return jsonResponse({ message: 'El email ya está registrado.' }, 409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const token = crypto.randomUUID();
    const nameData = buildDisplayName(firstName, lastName, email);

    await users.insertOne({
      email,
      passwordHash,
      role,
      token,
      firstName: nameData.firstName,
      lastName: nameData.lastName,
      fullName: nameData.fullName,
      createdAt: new Date(),
    });

    return jsonResponse({
      user: {
        email,
        role,
        firstName: nameData.firstName,
        lastName: nameData.lastName,
        fullName: nameData.fullName,
      },
      token,
    }, 201);
  }

  if (req.method === 'POST' && path === '/api/auth/login') {
    const body = await parseJson(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!email || !password) {
      return jsonResponse({ message: 'Email y contraseña son requeridos.' }, 400);
    }

    const user = await users.findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return jsonResponse({ message: 'Credenciales inválidas.' }, 401);
    }

    const token = user.token || crypto.randomUUID();
    if (!user.token) {
      await users.updateOne({ _id: user._id }, { $set: { token } });
    }

    const nameData = buildDisplayName(user.firstName, user.lastName, user.email);

    return jsonResponse({
      user: {
        email: user.email,
        role: user.role,
        firstName: nameData.firstName,
        lastName: nameData.lastName,
        fullName: nameData.fullName,
      },
      token,
    }, 200);
  }

  if (req.method === 'GET' && path === '/api/auth/me') {
    const user = await getUserFromRequest(req);
    if (!user) {
      return jsonResponse({ message: 'No autorizado.' }, 401);
    }

    const nameData = buildDisplayName(user.firstName, user.lastName, user.email);

    return jsonResponse({
      user: {
        email: user.email,
        role: user.role,
        firstName: nameData.firstName,
        lastName: nameData.lastName,
        fullName: nameData.fullName,
      },
    }, 200);
  }

  return jsonResponse({ message: 'Not found' }, 404);
}
