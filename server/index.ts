import 'dotenv/config';
import { serve } from 'bun';
import { connectDatabase } from './config/db.ts';
import { authHandler } from './routes/auth.ts';
import { pollsHandler } from './routes/polls.ts';
import { votesHandler } from './routes/votes.ts';
import { corsHeaders } from './utils.ts';

const port = Number(process.env.PORT || 3001);

await connectDatabase();

serve({
  port,
  fetch: async (req) => {
    const url = new URL(req.url);

    if (req.method === 'OPTIONS') {
      return new Response('OK', { headers: corsHeaders });
    }

    try {
      if (url.pathname.startsWith('/api/auth')) {
        return await authHandler(req);
      }

      if (url.pathname.startsWith('/api/polls') && (url.pathname.endsWith('/vote') || url.pathname.endsWith('/results'))) {
        return await votesHandler(req);
      }

      if (url.pathname.startsWith('/api/polls')) {
        return await pollsHandler(req);
      }

      return new Response(JSON.stringify({ message: 'Not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: 'Internal server error' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
});
