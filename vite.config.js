import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Only the local dev server needs the key here.
  // On Vercel, the serverless function in /api reads it instead.
  if (command === 'serve' && !env.TMDB_API_KEY) {
    throw new Error('TMDB_API_KEY is missing. Add it to your local .env file.');
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org',
          changeOrigin: true,
          rewrite: (path) => {
            const url = new URL(path, 'http://localhost');
            url.searchParams.set('api_key', env.TMDB_API_KEY);
            return url.pathname.replace('/api/tmdb', '/3') + url.search;
          },
        },
      },
    },
  };
});