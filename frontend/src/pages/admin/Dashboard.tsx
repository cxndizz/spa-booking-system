import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material'
import {
  CalendarMonth as CalendarIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material'

const stats = [
  {
    title: 'การจองวันนี้',
    value: '12',
    icon: <CalendarIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    color: '#e3f2fd',
  },
  {
    title: 'ลูกค้าทั้งหมด',
    value: '156',
    icon: <PeopleIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    color: '#e8f5e9',
  },
  {
    title: 'รายได้เดือนนี้',
    value: '฿45,000',
    icon: <MoneyIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
    color: '#fff3e0',
  },
  {
    title: 'อัตราการเติบโต',
    value: '+15%',
    icon: <TrendingIcon sx={{ fontSize: 40, color: 'info.main' }} />,
    color: '#e1f5fe',
  },
]

function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        แดชบอร์ด
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                การจองล่าสุด
              </Typography>
              <Typography color="text.secondary">
                ยังไม่มีข้อมูลการจอง
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                สรุปรายได้
              </Typography>
              <Typography color="text.secondary">
                ยังไม่มีข้อมูลรายได้
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
