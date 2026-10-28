export default async (req) => {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ status_message: 'TMDB_API_KEY is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const endpoint = url.pathname.replace(/^\/(api\/tmdb|\.netlify\/functions\/tmdb)\/?/, '');
  const params = new URLSearchParams(url.search);
  params.set('api_key', apiKey);

  try {
    const res = await fetch(`https://api.themoviedb.org/3/${endpoint}?${params}`);
    return new Response(await res.text(), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Movie data is unavailable right now.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};