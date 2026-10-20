import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (!env.TMDB_API_KEY) {
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