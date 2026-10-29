import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, CircularProgress, Typography,
} from '@mui/material';
import { IMG, tmdb } from '../api';
import WatchlistButton from './WatchlistButton';

export default function MediaGrid({ title, path, params = {} }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const result = await tmdb(path, JSON.parse(paramsKey));
        if (!cancelled) {
          setItems((result.results || []).filter((item) => item.media_type !== 'person'));
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [path, paramsKey, attempt]);

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        {title}
      </Typography>

      {loading && (
        <Box sx={{ minHeight: 220, display: 'grid', placeItems: 'center' }}>
          <CircularProgress aria-label="Loading titles" />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" onClick={() => setAttempt((value) => value + 1)}>Retry</Button>}
        >
          {error}. Check that your TMDB key is valid and restart the dev server.
        </Alert>
      )}

      {!loading && !error && items.length === 0 && (
        <Typography color="text.secondary">No titles found.</Typography>
      )}

      {!loading && !error && items.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: 2 }}>
          {items.map((item) => {
            const name = item.title || item.name || 'Untitled';
            const date = item.release_date || item.first_air_date;
            const mediaType = item.media_type || (path.startsWith('tv/') ? 'tv' : 'movie');

            return (
              <Card key={`${mediaType}-${item.id}`} sx={{ minWidth: 0 }}>
                <CardActionArea component={RouterLink} to={`/title/${mediaType}/${item.id}`} aria-label={`View details for ${name}`}>
                {item.poster_path ? (
                  <CardMedia
                    component="img"
                    image={`${IMG}w500${item.poster_path}`}
                    alt={`${name} poster`}
                    sx={{ aspectRatio: '2 / 3', objectFit: 'cover' }}
                  />
                ) : (
                  <Box sx={{ aspectRatio: '2 / 3', display: 'grid', placeItems: 'center', bgcolor: 'background.default' }}>
                    <Typography color="text.secondary">No poster</Typography>
                  </Box>
                )}
                <CardContent>
                  <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                    {name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                    {date ? date.slice(0, 4) : 'Release date unknown'}
                    {typeof item.vote_average === 'number' && ` · ${item.vote_average.toFixed(1)}/10`}
                  </Typography>
                </CardContent>
                </CardActionArea>
                <CardActions>
                  <WatchlistButton item={item} mediaType={mediaType} compact />
                </CardActions>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
}