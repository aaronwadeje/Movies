import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { getWatchlist, saveWatchlist } from '../api';

export default function WatchlistButton({ item, mediaType, compact = false }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const updateSaved = () => {
      setSaved(getWatchlist().some((entry) => entry.id === item.id && entry.media_type === mediaType));
    };

    updateSaved();
    window.addEventListener('watchlistchange', updateSaved);
    window.addEventListener('storage', updateSaved);
    return () => {
      window.removeEventListener('watchlistchange', updateSaved);
      window.removeEventListener('storage', updateSaved);
    };
  }, [item.id, mediaType]);

  function toggleWatchlist() {
    const watchlist = getWatchlist();
    const exists = watchlist.some((entry) => entry.id === item.id && entry.media_type === mediaType);
    const updated = exists
      ? watchlist.filter((entry) => entry.id !== item.id || entry.media_type !== mediaType)
      : [...watchlist, { ...item, media_type: mediaType }];

    saveWatchlist(updated);
  }

  return (
    <Button
      onClick={toggleWatchlist}
      startIcon={saved ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from watchlist' : 'Add to watchlist'}
      size="small"
    >
      {compact ? (saved ? 'Saved' : 'Add') : (saved ? 'Remove from watchlist' : 'Add to watchlist')}
    </Button>
  );
}