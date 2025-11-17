import { Box, Typography, Button, Container } from '@mui/material'
import { Home as HomeIcon, ArrowBack as BackIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFound() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <>
      <Helmet>
        <title>หน้าที่ไม่พบ - Spa Booking System</title>
      </Helmet>

      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          textAlign="center"
          gap={3}
        >
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '6rem', md: '8rem' },
              fontWeight: 'bold',
              color: 'primary.main',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            404
          </Typography>

          {/* Error Message */}
          <Typography
            variant="h4"
            color="text.primary"
            gutterBottom
            sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
          >
            ไม่พบหน้าที่คุณต้องการ
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: '1.1rem' }}
          >
            หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือไม่มีอยู่จริง
          </Typography>

          {/* Action Buttons */}
          <Box
            display="flex"
            gap={2}
            mt={2}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              กลับหน้าหลัก
            </Button>

            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={handleGoBack}
              size="large"
              sx={{
                borderRadius: 2,
                px: 3,
              }}
            >
              กลับหน้าเดิม
            </Button>
          </Box>

          {/* Decorative Element */}
          <Box
            sx={{
              width: 200,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2,
              mt: 4,
              opacity: 0.3,
            }}
          />
        </Box>
      </Container>
    </>
  )
}
