import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert, Box, Button, Chip, CircularProgress, Link, Stack, Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IMG, tmdb } from '../api';

export default function TitleDetails() {
  const { mediaType, id } = useParams();
  const [title, setTitle] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const [details, videoData] = await Promise.all([
          tmdb(`${mediaType}/${id}`),
          tmdb(`${mediaType}/${id}/videos`),
        ]);
        if (!cancelled) {
          setTitle(details);
          setVideos(videoData.results || []);
        }
      } catch (requestError) {
        if (!cancelled) setError(requestError.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [mediaType, id]);

  if (loading) {
    return <Box sx={{ minHeight: 300, display: 'grid', placeItems: 'center' }}><CircularProgress aria-label="Loading title details" /></Box>;
  }

  if (error || !title) {
    return (
      <Stack spacing={2}>
        <Alert severity="error">{error || 'Title not found.'}</Alert>
        <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ alignSelf: 'flex-start' }}>Back to titles</Button>
      </Stack>
    );
  }

  const name = title.title || title.name || 'Untitled';
  const releaseDate = title.release_date || title.first_air_date;
  const trailer = videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer' && video.official)
    || videos.find((video) => video.site === 'YouTube' && video.type === 'Trailer')
    || videos.find((video) => video.site === 'YouTube');
  const backdrop = title.backdrop_path ? `${IMG}w1280${title.backdrop_path}` : null;

  return (
    <Box>
      <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>Back</Button>
      {backdrop && (
        <Box
          role="img"
          aria-label={`${name} backdrop`}
          sx={{ minHeight: { xs: 190, md: 320 }, mb: 3, backgroundImage: `linear-gradient(90deg, rgba(13,17,23,.9), rgba(13,17,23,.2)), url(${backdrop})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', borderRadius: 1 }}
        />
      )}
      <Stack spacing={2} sx={{ maxWidth: 960 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>{name}</Typography>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="center">
          {releaseDate && <Typography color="text.secondary">{releaseDate.slice(0, 4)}</Typography>}
          {title.runtime && <Typography color="text.secondary">{title.runtime} min</Typography>}
          {title.episode_run_time?.[0] && <Typography color="text.secondary">{title.episode_run_time[0]} min / episode</Typography>}
          {typeof title.vote_average === 'number' && <Chip label={`★ ${title.vote_average.toFixed(1)} / 10`} color="primary" size="small" />}
          {(title.genres || []).map((genre) => <Chip key={genre.id} label={genre.name} size="small" variant="outlined" />)}
        </Stack>
        {title.overview && <Typography variant="body1" sx={{ lineHeight: 1.75 }}>{title.overview}</Typography>}
        <Box component="section" aria-labelledby="trailer-heading" sx={{ pt: 1 }}>
          <Typography id="trailer-heading" variant="h5" component="h2" sx={{ mb: 1.5, fontWeight: 700 }}>Trailer</Typography>
          {trailer ? (
            <Box sx={{ aspectRatio: '16 / 9', width: '100%', maxWidth: 850, bgcolor: 'background.paper' }}>
              <Box
                component="iframe"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(trailer.key)}`}
                title={`${name} - ${trailer.name || 'Trailer'}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                sx={{ width: '100%', height: '100%', border: 0 }}
              />
            </Box>
          ) : (
            <Typography color="text.secondary">No YouTube trailer is available for this title.</Typography>
          )}
          {trailer && <Link href={`https://www.youtube.com/watch?v=${encodeURIComponent(trailer.key)}`} target="_blank" rel="noreferrer" sx={{ display: 'inline-block', mt: 1 }}>Open trailer on YouTube</Link>}
        </Box>
      </Stack>
    </Box>
  );
}