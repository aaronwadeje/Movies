# Wadeje Movies

React and Vite movie browser powered by TMDB.

## Netlify setup

Set `TMDB_API_KEY` in the site's Netlify environment variables. Use the TMDB API key (v3 auth), enable access for Functions, and provide a value for each deploy context you use, including Production and Deploy Previews. Redeploy after changing the setting. Never prefix this key with `VITE_` or put it in browser code.

Requests to `/api/tmdb/*` run through a Netlify Function that forwards them to TMDB API v3. The key stays on the server. Client routes fall back to `index.html` so direct links to movie details and searches work.

## Local development

Install dependencies with `npm install`. Copy `.env.example` to `.env` and set `TMDB_API_KEY`, then run `npm run dev`. The Vite development server proxies TMDB requests locally. Restart it after changing `.env`.

To test the deployed Netlify Function locally, use `netlify dev --port 8889` with the key available in the local development context.

Run `npm run lint` to check the source.
