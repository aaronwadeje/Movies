import { Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import MediaGrid from '../components/MediaGrid';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || '';

  if (!query) return <Typography variant="h5">Enter a title to search.</Typography>;

  return (
    <MediaGrid
      title={`Search results for "${query}"`}
      path="search/multi"
      params={{ query, include_adult: false }}
    />
  );
}