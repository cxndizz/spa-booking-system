import { Box, Card, CardContent, Typography, Chip, List, ListItem, Divider } from '@mui/material'

const bookings = [
  {
    id: 1,
    service: 'นวดแผนไทย',
    date: '2024-01-15',
    time: '14:00',
    status: 'confirmed',
  },
  {
    id: 2,
    service: 'สปาหน้า',
    date: '2024-01-20',
    time: '10:00',
    status: 'pending',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'cancelled':
      return 'error'
    default:
      return 'default'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'ยืนยันแล้ว'
    case 'pending':
      return 'รอการยืนยัน'
    case 'cancelled':
      return 'ยกเลิก'
    default:
      return status
  }
}

function LiffMyBookings() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        การจองของฉัน
      </Typography>

      {bookings.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary" textAlign="center">
              ยังไม่มีการจอง
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <List sx={{ p: 0 }}>
          {bookings.map((booking, index) => (
            <Card key={booking.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">{booking.service}</Typography>
                  <Chip
                    label={getStatusText(booking.status)}
                    color={getStatusColor(booking.status) as 'success' | 'warning' | 'error' | 'default'}
                    size="small"
                  />
                </Box>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  วันที่: {booking.date}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  เวลา: {booking.time} น.
                </Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  )
}

export default LiffMyBookings
