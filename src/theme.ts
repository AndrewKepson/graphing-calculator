import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0c10',
      paper: '#14181f',
    },
    primary: {
      main: '#00f2ff',
      contrastText: '#0a0c10',
    },
    secondary: {
      main: '#7000ff',
    },
    text: {
      primary: '#e0e6ed',
      secondary: '#718096',
    },
    divider: '#2d3748',
  },
  typography: {
    fontFamily: ['Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'].join(','),
  },
  shape: {
    borderRadius: 4,
  },
})
