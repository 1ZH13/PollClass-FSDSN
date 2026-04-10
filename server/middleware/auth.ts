import { users } from '../config/db.ts';

export async function getUserFromRequest(req) {
  const authorization = req.headers.get('Authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) {
    return null;
  }
  return await users.findOne({ token });
}
