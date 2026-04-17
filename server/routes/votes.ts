import { polls, votes } from '../config/db.ts';
import { getUserFromRequest } from '../middleware/auth.ts';
import { jsonResponse, parseJson, parseObjectId, serializeDoc, serializeDocs } from '../utils.ts';

export async function votesHandler(req) {
  const url = new URL(req.url);
  const path = url.pathname;
  const segments = path.split('/').filter(Boolean);

  function resolveVoterName(user) {
    const first = String(user?.firstName || '').trim();
    const last = String(user?.lastName || '').trim();
    const full = `${first} ${last}`.trim();
    if (full) {
      return full;
    }
    const email = String(user?.email || '').trim();
    return email.split('@')[0] || email;
  }

  if (segments.length === 4 && segments[1] === 'polls' && segments[3] === 'vote' && req.method === 'POST') {
    const user = await getUserFromRequest(req);
    if (!user) {
      return jsonResponse({ message: 'No autorizado.' }, 401);
    }

    if (user.role !== 'student') {
      return jsonResponse({ message: 'Solo estudiantes pueden votar.' }, 403);
    }

    const pollId = parseObjectId(segments[2]);
    if (!pollId) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    const body = await parseJson(req);
    const optionIndex = Number(body.optionIndex);
    if (Number.isNaN(optionIndex)) {
      return jsonResponse({ message: 'optionIndex es requerido.' }, 400);
    }

    const poll = await polls.findOne({ _id: pollId });
    if (!poll) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    if (poll.status === 'closed') {
      return jsonResponse({ message: 'Esta encuesta está cerrada.' }, 400);
    }

    const voterEmail = String(user.email).toLowerCase();
    const existingVote = await votes.findOne({ pollId, voterEmail });
    if (existingVote) {
      return jsonResponse({ message: 'Ya votaste en esta encuesta.' }, 409);
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return jsonResponse({ message: 'Opción inválida.' }, 400);
    }

    const vote = {
      pollId,
      optionIndex,
      voterEmail,
      voterName: resolveVoterName(user),
      createdAt: new Date(),
    };

    await Promise.all([
      votes.insertOne(vote),
      polls.updateOne({ _id: pollId }, { $inc: { [`options.${optionIndex}.votes`]: 1 } }),
    ]);

    return jsonResponse({ message: 'Voto registrado.' }, 201);
  }

  if (segments.length === 4 && segments[1] === 'polls' && segments[3] === 'results' && req.method === 'GET') {
    const pollId = parseObjectId(segments[2]);
    if (!pollId) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    const poll = await polls.findOne({ _id: pollId });
    if (!poll) {
      return jsonResponse({ message: 'Poll not found.' }, 404);
    }

    const votesList = await votes.find({ pollId }).sort({ createdAt: -1 }).toArray();
    return jsonResponse({ poll: serializeDoc(poll), votes: serializeDocs(votesList) });
  }

  return jsonResponse({ message: 'Not found' }, 404);
}
