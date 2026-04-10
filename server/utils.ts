import { ObjectId } from 'mongodb';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export async function parseJson(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}

export function serializeDoc(doc) {
  if (!doc || typeof doc !== 'object') {
    return doc;
  }

  const copy = { ...doc };

  if (copy._id) {
    copy._id = String(copy._id);
  }

  if (copy.pollId) {
    copy.pollId = String(copy.pollId);
  }

  return copy;
}

export function serializeDocs(docs) {
  return Array.isArray(docs) ? docs.map(serializeDoc) : docs;
}

export function parseObjectId(value) {
  try {
    return new ObjectId(String(value));
  } catch {
    return null;
  }
}
