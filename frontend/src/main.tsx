import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { HelmetProvider } from 'react-helmet-async'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@mui/material/CssBaseline'

import App from './App.tsx'
import { theme } from './theme'
import { AuthProvider } from './hooks/useAuth'
import { LiffProvider } from './hooks/useLiff'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HelmetProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                autoHideDuration={5000}
              >
                <CssBaseline />
                <AuthProvider>
                  <LiffProvider>
                    <App />
                  </LiffProvider>
                </AuthProvider>
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
