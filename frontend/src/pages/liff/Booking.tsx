import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs, { Dayjs } from 'dayjs'
import { useLiff } from '../../hooks/useLiff'

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
}

interface TimeSlot {
  time: string
  available: boolean
}

interface Staff {
  id: string
  name: string
  avatar?: string
}

const steps = ['เลือกบริการ', 'เลือกวันที่', 'เลือกเวลา', 'ยืนยันการจอง']

function Booking() {
  const { liffProfile, isLiffLoggedIn } = useLiff()
  const [activeStep, setActiveStep] = useState(0)
  const [services, setServices] = useState<Service[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [staff, setStaff] = useState<Staff[]>([])
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    fetchServices()
    fetchStaff()
  }, [])

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchTimeSlots()
    }
  }, [selectedDate, selectedService])

  const fetchServices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/v1/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.data || [])
      } else {
        // Mock data for development
        setServices([
          { id: '1', name: 'นวดแผนไทย', description: 'นวดแผนไทยโบราณ', duration: 60, price: 500 },
          { id: '2', name: 'นวดน้ำมัน', description: 'นวดน้ำมันอโรมา', duration: 90, price: 800 },
          { id: '3', name: 'สปาหน้า', description: 'ทรีทเมนต์บำรุงผิวหน้า', duration: 45, price: 600 },
          { id: '4', name: 'แพ็คเกจ Full Body', description: 'นวดเต็มตัว + สปาหน้า', duration: 120, price: 1200 },
        ])
      }
    } catch (err) {
      console.error('Error fetching services:', err)
      // Mock data for development
      setServices([
        { id: '1', name: 'นวดแผนไทย', description: 'นวดแผนไทยโบราณ', duration: 60, price: 500 },
        { id: '2', name: 'นวดน้ำมัน', description: 'นวดน้ำมันอโรมา', duration: 90, price: 800 },
        { id: '3', name: 'สปาหน้า', description: 'ทรีทเมนต์บำรุงผิวหน้า', duration: 45, price: 600 },
        { id: '4', name: 'แพ็คเกจ Full Body', description: 'นวดเต็มตัว + สปาหน้า', duration: 120, price: 1200 },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/v1/staff')
      if (response.ok) {
        const data = await response.json()
        setStaff(data.data || [])
      } else {
        // Mock data
        setStaff([
          { id: '1', name: 'คุณสมหญิง' },
          { id: '2', name: 'คุณวิภา' },
          { id: '3', name: 'คุณนิดา' },
        ])
      }
    } catch (err) {
      console.error('Error fetching staff:', err)
      setStaff([
        { id: '1', name: 'คุณสมหญิง' },
        { id: '2', name: 'คุณวิภา' },
        { id: '3', name: 'คุณนิดา' },
      ])
    }
  }

  const fetchTimeSlots = async () => {
    if (!selectedDate || !selectedService) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/v1/bookings/available-slots?date=${selectedDate.format('YYYY-MM-DD')}&serviceId=${selectedService.id}`
      )
      if (response.ok) {
        const data = await response.json()
        setTimeSlots(data.data || [])
      } else {
        // Mock time slots
        const mockSlots: TimeSlot[] = []
        for (let hour = 10; hour <= 19; hour++) {
          mockSlots.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            available: Math.random() > 0.3,
          })
          if (hour < 19) {
            mockSlots.push({
              time: `${hour.toString().padStart(2, '0')}:30`,
              available: Math.random() > 0.3,
            })
          }
        }
        setTimeSlots(mockSlots)
      }
    } catch (err) {
      console.error('Error fetching time slots:', err)
      // Mock time slots
      const mockSlots: TimeSlot[] = []
      for (let hour = 10; hour <= 19; hour++) {
        mockSlots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.3,
        })
      }
      setTimeSlots(mockSlots)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    setActiveStep((prev: number) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev: number) => prev - 1)
  }

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    handleNext()
  }

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date)
    setSelectedTime(null)
    if (date) {
      handleNext()
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    handleNext()
  }

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setError('กรุณาเลือกข้อมูลให้ครบถ้วน')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineUserId: liffProfile?.userId,
          serviceId: selectedService.id,
          staffId: selectedStaff?.id,
          bookingDate: selectedDate.format('YYYY-MM-DD'),
          bookingTime: selectedTime,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'การจองล้มเหลว')
      }

      setBookingSuccess(true)
      setConfirmDialog(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsLoading(false)
    }
  }

  const resetBooking = () => {
    setActiveStep(0)
    setSelectedService(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setSelectedStaff(null)
    setBookingSuccess(false)
    setError(null)
  }

  if (!isLiffLoggedIn) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">กรุณาเข้าสู่ระบบ LINE</Typography>
      </Box>
    )
  }

  if (bookingSuccess) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          จองคิวสำเร็จ!
        </Alert>
        <Typography variant="h6" gutterBottom>
          รายละเอียดการจอง
        </Typography>
        <Typography>บริการ: {selectedService?.name}</Typography>
        <Typography>วันที่: {selectedDate?.format('DD/MM/YYYY')}</Typography>
        <Typography>เวลา: {selectedTime}</Typography>
        <Typography>ราคา: ฿{selectedService?.price}</Typography>
        <Button variant="contained" onClick={resetBooking} sx={{ mt: 3 }}>
          จองคิวใหม่
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Step 1: Select Service */}
          {activeStep === 0 && (
            <Grid container spacing={2}>
              {services.map((service) => (
                <Grid item xs={12} key={service.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { boxShadow: 3 },
                    }}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <CardContent>
                      <Typography variant="h6">{service.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip label={`${service.duration} นาที`} size="small" sx={{ mr: 1 }} />
                        <Chip label={`฿${service.price}`} size="small" color="primary" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Step 2: Select Date */}
          {activeStep === 1 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  เลือกวันที่
                </Typography>
                <DateCalendar
                  value={selectedDate}
                  onChange={handleDateSelect}
                  minDate={dayjs()}
                  maxDate={dayjs().add(30, 'day')}
                />
                <Button onClick={handleBack} sx={{ mt: 2 }}>
                  ย้อนกลับ
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Select Time */}
          {activeStep === 2 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  เลือกเวลา - {selectedDate?.format('DD/MM/YYYY')}
                </Typography>
                <Grid container spacing={1}>
                  {timeSlots.map((slot) => (
                    <Grid item xs={4} key={slot.time}>
                      <Button
                        variant={selectedTime === slot.time ? 'contained' : 'outlined'}
                        fullWidth
                        disabled={!slot.available}
                        onClick={() => handleTimeSelect(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                <Button onClick={handleBack} sx={{ mt: 2 }}>
                  ย้อนกลับ
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirm Booking */}
          {activeStep === 3 && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ยืนยันการจอง
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography><strong>บริการ:</strong> {selectedService?.name}</Typography>
                  <Typography><strong>วันที่:</strong> {selectedDate?.format('DD/MM/YYYY')}</Typography>
                  <Typography><strong>เวลา:</strong> {selectedTime}</Typography>
                  <Typography><strong>ระยะเวลา:</strong> {selectedService?.duration} นาที</Typography>
                  <Typography><strong>ราคา:</strong> ฿{selectedService?.price}</Typography>
                </Box>

                {staff.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      เลือกพนักงาน (ไม่บังคับ)
                    </Typography>
                    <Grid container spacing={1}>
                      {staff.map((s) => (
                        <Grid item xs={4} key={s.id}>
                          <Button
                            variant={selectedStaff?.id === s.id ? 'contained' : 'outlined'}
                            size="small"
                            fullWidth
                            onClick={() => setSelectedStaff(s)}
                          >
                            {s.name}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Button onClick={handleBack}>ย้อนกลับ</Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setConfirmDialog(true)}
                  >
                    ยืนยันการจอง
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>ยืนยันการจอง</DialogTitle>
        <DialogContent>
          <Typography>คุณต้องการจองคิวนี้ใช่หรือไม่?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedService?.name} - {selectedDate?.format('DD/MM/YYYY')} เวลา {selectedTime}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleConfirmBooking} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'ยืนยัน'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Booking
