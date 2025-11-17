import { Box, CircularProgress, Typography } from '@mui/material'
import { Spa as SpaIcon } from '@mui/icons-material'

interface LoadingPageProps {
  message?: string
}

export default function LoadingPage({ message = 'กำลังโหลด...' }: LoadingPageProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      gap={3}
    >
      <SpaIcon 
        sx={{ 
          fontSize: 60, 
          color: 'primary.main',
          animation: 'pulse 2s infinite'
        }} 
      />
      
      <CircularProgress 
        size={40}
        thickness={4}
        sx={{ color: 'primary.main' }}
      />
      
      <Typography 
        variant="h6" 
        color="text.secondary"
        textAlign="center"
      >
        {message}
      </Typography>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  )
}
