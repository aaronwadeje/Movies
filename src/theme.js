import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2ee6a6' },
    background: { default: '#0d1117', paper: '#161c26' },
  },
  shape: { borderRadius: 10 },
});

export default theme;