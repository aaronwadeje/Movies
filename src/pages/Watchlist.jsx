import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography,
} from '@mui/material';
import { getWatchlist, IMG } from '../api';
import WatchlistButton from '../components/WatchlistButton';

export default function Watchlist() {
  const [items, setItems] = useState(getWatchlist);

  useEffect(() => {
    const updateItems = () => setItems(getWatchlist());
    window.addEventListener('watchlistchange', updateItems);
    window.addEventListener('storage', updateItems);
    return () => {
      window.removeEventListener('watchlistchange', updateItems);
      window.removeEventListener('storage', updateItems);
    };
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>My Watchlist</Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">Your watchlist is empty.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 2 }}>
          {items.map((item) => {
            const name = item.title || item.name || 'Untitled';
            const date = item.release_date || item.first_air_date;

            return (
              <Card key={`${item.media_type}-${item.id}`} sx={{ minWidth: 0 }}>
                <CardActionArea component={RouterLink} to={`/title/${item.media_type}/${item.id}`} aria-label={`View details for ${name}`}>
                  {item.poster_path ? (
                    <CardMedia component="img" image={`${IMG}w500${item.poster_path}`} alt={`${name} poster`} sx={{ aspectRatio: '2 / 3', objectFit: 'cover' }} />
                  ) : (
                    <Box sx={{ aspectRatio: '2 / 3', display: 'grid', placeItems: 'center', bgcolor: 'background.default' }}>
                      <Typography color="text.secondary">No poster</Typography>
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>{name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                      {date ? date.slice(0, 4) : 'Release date unknown'}
                      {typeof item.vote_average === 'number' && ` · ${item.vote_average.toFixed(1)}/10`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <WatchlistButton item={item} mediaType={item.media_type} compact />
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}