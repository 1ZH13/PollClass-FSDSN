import User from '../models/User.ts';

export async function getUserFromRequest(c) {
  const authorization = c.req.header('Authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) {
    return null;
  }
  return (await User.findOne({ token }).lean()) as any;
}
