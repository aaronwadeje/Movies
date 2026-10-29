export const IMG = 'https://image.tmdb.org/t/p/';
const WATCHLIST_KEY = 'wadeje-movies-watchlist';

export function getWatchlist() {
  try {
    const saved = JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveWatchlist(items) {
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('watchlistchange'));
}

export async function tmdb(path, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
  ).toString();
  const response = await fetch(`/api/tmdb/${path.replace(/^\/+/, '')}${query ? `?${query}` : ''}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.status_message || `TMDB request failed (${response.status}).`);
  }

  return data;
}