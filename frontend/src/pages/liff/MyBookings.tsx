import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Divider,
} from '@mui/material'
import {
  CalendarMonth as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import { useLiff } from '../../hooks/useLiff'

interface Booking {
  id: string
  serviceName: string
  serviceDescription?: string
  bookingDate: string
  bookingTime: string
  duration: number
  price: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  staffName?: string
  notes?: string
  createdAt: string
}

const statusColors: Record<Booking['status'], 'warning' | 'success' | 'info' | 'error'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'info',
  CANCELLED: 'error',
}

const statusLabels: Record<Booking['status'], string> = {
  PENDING: 'รอยืนยัน',
  CONFIRMED: 'ยืนยันแล้ว',
  COMPLETED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก',
}

function MyBookings() {
  const { liffProfile, isLiffLoggedIn } = useLiff()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelDialog, setCancelDialog] = useState<Booking | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (isLiffLoggedIn && liffProfile) {
      fetchBookings()
    }
  }, [isLiffLoggedIn, liffProfile])

  const fetchBookings = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/v1/liff/my-bookings?lineUserId=${liffProfile?.userId}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data.data || [])
      } else {
        // Mock data for development
        setBookings([
          {
            id: '1',
            serviceName: 'นวดแผนไทย',
            serviceDescription: 'นวดแผนไทยโบราณ',
            bookingDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
            bookingTime: '14:00',
            duration: 60,
            price: 500,
            status: 'CONFIRMED',
            staffName: 'คุณสมหญิง',
            createdAt: dayjs().subtract(1, 'day').toISOString(),
          },
          {
            id: '2',
            serviceName: 'สปาหน้า',
            serviceDescription: 'ทรีทเมนต์บำรุงผิวหน้า',
            bookingDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
            bookingTime: '10:30',
            duration: 45,
            price: 600,
            status: 'PENDING',
            createdAt: dayjs().toISOString(),
          },
          {
            id: '3',
            serviceName: 'นวดน้ำมัน',
            bookingDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
            bookingTime: '16:00',
            duration: 90,
            price: 800,
            status: 'COMPLETED',
            staffName: 'คุณวิภา',
            createdAt: dayjs().subtract(5, 'day').toISOString(),
          },
        ])
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('ไม่สามารถโหลดข้อมูลการจองได้')
      // Mock data
      setBookings([
        {
          id: '1',
          serviceName: 'นวดแผนไทย',
          bookingDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
          bookingTime: '14:00',
          duration: 60,
          price: 500,
          status: 'CONFIRMED',
          staffName: 'คุณสมหญิง',
          createdAt: dayjs().subtract(1, 'day').toISOString(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!cancelDialog) return

    setIsCancelling(true)
    try {
      const response = await fetch(`/api/v1/liff/bookings/${cancelDialog.id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineUserId: liffProfile?.userId,
        }),
      })

      if (response.ok) {
        // Update local state
        setBookings((prev) =>
          prev.map((b) =>
            b.id === cancelDialog.id ? { ...b, status: 'CANCELLED' as const } : b
          )
        )
        setCancelDialog(null)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'ไม่สามารถยกเลิกการจองได้')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsCancelling(false)
    }
  }

  const upcomingBookings = bookings.filter(
    (b) =>
      (b.status === 'PENDING' || b.status === 'CONFIRMED') &&
      dayjs(b.bookingDate).isAfter(dayjs().subtract(1, 'day'))
  )

  const pastBookings = bookings.filter(
    (b) =>
      b.status === 'COMPLETED' ||
      b.status === 'CANCELLED' ||
      dayjs(b.bookingDate).isBefore(dayjs().subtract(1, 'day'))
  )

  if (!isLiffLoggedIn) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">กรุณาเข้าสู่ระบบ LINE</Typography>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        การจองของฉัน
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label={`กำลังมาถึง (${upcomingBookings.length})`} />
        <Tab label={`ประวัติ (${pastBookings.length})`} />
      </Tabs>

      {tabValue === 0 && (
        <>
          {upcomingBookings.length === 0 ? (
            <Alert severity="info">ไม่มีการจองที่กำลังมาถึง</Alert>
          ) : (
            upcomingBookings.map((booking) => (
              <Card key={booking.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{booking.serviceName}</Typography>
                    <Chip
                      label={statusLabels[booking.status]}
                      color={statusColors[booking.status]}
                      size="small"
                    />
                  </Box>

                  {booking.serviceDescription && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {booking.serviceDescription}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {dayjs(booking.bookingDate).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <TimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {booking.bookingTime} ({booking.duration} นาที)
                    </Typography>
                  </Box>

                  {booking.staffName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">{booking.staffName}</Typography>
                    </Box>
                  )}

                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    ราคา: ฿{booking.price}
                  </Typography>

                  {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => setCancelDialog(booking)}
                      sx={{ mt: 2 }}
                    >
                      ยกเลิกการจอง
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </>
      )}

      {tabValue === 1 && (
        <>
          {pastBookings.length === 0 ? (
            <Alert severity="info">ไม่มีประวัติการจอง</Alert>
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id} sx={{ mb: 2, opacity: 0.8 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{booking.serviceName}</Typography>
                    <Chip
                      label={statusLabels[booking.status]}
                      color={statusColors[booking.status]}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {dayjs(booking.bookingDate).format('DD/MM/YYYY')}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <TimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">{booking.bookingTime}</Typography>
                  </Box>

                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    ราคา: ฿{booking.price}
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </>
      )}

      <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)}>
        <DialogTitle>ยืนยันการยกเลิก</DialogTitle>
        <DialogContent>
          <Typography>คุณต้องการยกเลิกการจองนี้ใช่หรือไม่?</Typography>
          {cancelDialog && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {cancelDialog.serviceName} - {dayjs(cancelDialog.bookingDate).format('DD/MM/YYYY')}{' '}
              เวลา {cancelDialog.bookingTime}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(null)}>ไม่ใช่</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelBooking}
            disabled={isCancelling}
          >
            {isCancelling ? <CircularProgress size={24} /> : 'ยืนยันยกเลิก'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyBookings
