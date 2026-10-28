export default async (request: Request) => {
  if (request.method !== 'GET') {
    return Response.json({ status_message: 'Method not allowed.' }, {
      status: 405,
      headers: { Allow: 'GET' },
    });
  }

  const apiKey = Netlify.env.get('TMDB_API_KEY');
  if (!apiKey) {
    return Response.json({
      status_message: 'The movie service is not configured. Set TMDB_API_KEY in Netlify for this deploy context with Functions access, then redeploy.',
    }, { status: 503 });
  }

  const incoming = new URL(request.url);
  const path = incoming.pathname.replace(/^\/api\/tmdb\//, '');
  if (!/^[a-zA-Z0-9_/-]+$/.test(path) || path === incoming.pathname) {
    return Response.json({ status_message: 'Invalid movie service path.' }, { status: 400 });
  }

  const upstream = new URL(`https://api.themoviedb.org/3/${path}`);
  upstream.search = incoming.search;
  upstream.searchParams.set('api_key', apiKey);

  try {
    const response = await fetch(upstream, { signal: AbortSignal.timeout(10000) });
    const data = await response.json();
    if (!response.ok) {
      const status = response.status === 401 || response.status === 403 ? 503 : response.status;
      const message = status === 503
        ? 'The movie service credentials are invalid. Check TMDB_API_KEY in Netlify, then redeploy.'
        : response.status === 404
          ? 'The requested movie or TV resource was not found.'
          : 'The movie service could not complete the request. Please try again.';
      return Response.json({ status_message: message }, { status });
    }
    return Response.json(data);
  } catch {
    return Response.json({
      status_message: 'The movie service is temporarily unavailable. Please try again.',
    }, { status: 502 });
  }
};

export const config = { path: '/api/tmdb/*' };
