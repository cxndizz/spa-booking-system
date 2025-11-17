import { Outlet } from 'react-router-dom'
import { Box, AppBar, Toolbar, Typography, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { CalendarMonth as CalendarIcon, List as ListIcon, Person as PersonIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

function LiffLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (location.pathname.includes('/booking')) {
      setValue(0)
    } else if (location.pathname.includes('/my-bookings')) {
      setValue(1)
    } else if (location.pathname.includes('/profile')) {
      setValue(2)
    }
  }, [location.pathname])

  const handleNavigation = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    switch (newValue) {
      case 0:
        navigate('/liff/booking')
        break
      case 1:
        navigate('/liff/my-bookings')
        break
      case 2:
        navigate('/liff/profile')
        break
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Spa Booking
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '56px',
          mb: '56px',
          p: 2,
          backgroundColor: '#f5f5f5',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={value} onChange={handleNavigation} showLabels>
          <BottomNavigationAction label="จองคิว" icon={<CalendarIcon />} />
          <BottomNavigationAction label="การจองของฉัน" icon={<ListIcon />} />
          <BottomNavigationAction label="โปรไฟล์" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default LiffLayout
