import { createTheme } from '@mui/material/styles'
import { thTH } from '@mui/material/locale'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32', // สีเขียวสปา
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8BC34A', // สีเขียวอ่อน
      light: '#CDDC39',
      dark: '#689F38',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E2E2E',
      secondary: '#666666',
    },
    error: {
      main: '#F44336',
    },
    warning: {
      main: '#FF9800',
    },
    info: {
      main: '#2196F3',
    },
    success: {
      main: '#4CAF50',
    },
  },
  typography: {
    fontFamily: [
      'Kanit',
      'Roboto', 
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.1rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
          border: '1px solid #E0E0E0',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F5F5F5',
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
  },
}, thTH) // Thai locale for date pickers, etc.

export default theme
