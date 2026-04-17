import { getUserFromRequest } from '../middleware/auth.ts';
import { polls } from '../config/db.ts';
import { jsonResponse, parseJson, parseObjectId, serializeDoc, serializeDocs } from '../utils.ts';

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function createUniqueCode() {
  let code = generateCode();
  while (await polls.findOne({ code })) {
    code = generateCode();
  }
  return code;
}

export async function pollsHandler(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const segments = path.split('/').filter(Boolean);

  if (req.method === 'GET' && segments.length === 2) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'professor') {
      return jsonResponse({ message: 'No autorizado.' }, 401);
    }

    const list = await polls.find({ createdByEmail: String(user.email).toLowerCase() }).sort({ createdAt: -1 }).toArray();
    return jsonResponse(serializeDocs(list));
  }

  if (req.method === 'POST' && segments.length === 2) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'professor') {
      return jsonResponse({ message: 'No autorizado.' }, 401);
    }

    const body = await parseJson(req);
    const title = String(body.title || '').trim();
    const options = Array.isArray(body.options)
      ? body.options.map((text) => String(text).trim()).filter(Boolean)
      : [];

    if (!title || options.length < 2) {
      return jsonResponse({ message: 'Title and at least 2 options are required.' }, 400);
    }

    const pollData = {
      title,
      options: options.map((text) => ({ text, votes: 0 })),
      code: await createUniqueCode(),
      status: 'active',
      createdByEmail: String(user.email).toLowerCase(),
      createdByName: String(user.fullName || user.email || '').trim(),
      createdAt: new Date(),
    };

    const result = await polls.insertOne(pollData);
    const created = await polls.findOne({ _id: result.insertedId });
    return jsonResponse(serializeDoc(created), 201);
  }

  if (req.method === 'GET' && segments.length === 3 && segments[1] === 'polls') {
    const pollId = parseObjectId(segments[2]);
    if (!pollId) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    const poll = await polls.findOne({ _id: pollId });
    if (!poll) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    return jsonResponse(serializeDoc(poll));
  }

  if (req.method === 'GET' && segments.length === 4 && segments[2] === 'code') {
    const code = String(segments[3]).toUpperCase();
    const poll = await polls.findOne({ code, status: 'active' });
    if (!poll) {
      return jsonResponse({ message: 'Encuesta no encontrada o cerrada.' }, 404);
    }
    return jsonResponse(serializeDoc(poll));
  }

  if (req.method === 'PATCH' && segments.length === 4 && segments[3] === 'close') {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'professor') {
      return jsonResponse({ message: 'No autorizado.' }, 401);
    }

    const pollId = parseObjectId(segments[2]);
    if (!pollId) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    const updated = await polls.findOneAndUpdate(
      { _id: pollId, createdByEmail: String(user.email).toLowerCase() },
      { $set: { status: 'closed', closedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updated.value) {
      return jsonResponse({ message: 'Poll not found or not owned by this professor.' }, 404);
    }

    return jsonResponse(serializeDoc(updated.value));
  }

  if (req.method === 'DELETE' && segments.length === 3 && segments[1] === 'polls') {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'professor') {
      return jsonResponse({ message: 'No autorizado.' }, 401);
    }

    const pollId = parseObjectId(segments[2]);
    if (!pollId) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    const deleted = await polls.deleteOne({ _id: pollId, createdByEmail: String(user.email).toLowerCase() });
    if (deleted.deletedCount === 0) {
      return jsonResponse({ message: 'Poll not found or not owned by this professor.' }, 404);
    }

    return jsonResponse({ message: 'Poll deleted.' });
  }

  return jsonResponse({ message: 'Not found' }, 404);
}
