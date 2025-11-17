import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Alert,
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'

const services = [
  { id: 1, name: 'นวดแผนไทย', duration: 60, price: 500 },
  { id: 2, name: 'นวดน้ำมันอโรมา', duration: 90, price: 800 },
  { id: 3, name: 'สปาหน้า', duration: 45, price: 600 },
  { id: 4, name: 'แพ็คเกจผ่อนคลาย', duration: 120, price: 1500 },
]

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00', '19:00',
]

const steps = ['เลือกบริการ', 'เลือกวันเวลา', 'ยืนยันการจอง']

function LiffBooking() {
  const [activeStep, setActiveStep] = useState(0)
  const [selectedService, setSelectedService] = useState<number | ''>('')
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit booking
      setBookingSuccess(true)
    } else {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return selectedService !== ''
      case 1:
        return selectedDate !== null && selectedTime !== ''
      case 2:
        return true
      default:
        return false
    }
  }

  const selectedServiceData = services.find((s) => s.id === selectedService)

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormControl fullWidth>
            <InputLabel>เลือกบริการ</InputLabel>
            <Select
              value={selectedService}
              label="เลือกบริการ"
              onChange={(e) => setSelectedService(e.target.value as number)}
            >
              {services.map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.name} - {service.duration} นาที (฿{service.price})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )
      case 1:
        return (
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="เลือกวันที่"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDate={dayjs()}
                sx={{ width: '100%', mb: 3 }}
              />
            </LocalizationProvider>

            {selectedDate && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  เลือกเวลา
                </Typography>
                <Grid container spacing={1}>
                  {timeSlots.map((time) => (
                    <Grid item xs={4} key={time}>
                      <Chip
                        label={time}
                        onClick={() => setSelectedTime(time)}
                        color={selectedTime === time ? 'primary' : 'default'}
                        variant={selectedTime === time ? 'filled' : 'outlined'}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        )
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              สรุปการจอง
            </Typography>
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 2 }}>
              <Typography>
                <strong>บริการ:</strong> {selectedServiceData?.name}
              </Typography>
              <Typography>
                <strong>ระยะเวลา:</strong> {selectedServiceData?.duration} นาที
              </Typography>
              <Typography>
                <strong>วันที่:</strong> {selectedDate?.format('DD/MM/YYYY')}
              </Typography>
              <Typography>
                <strong>เวลา:</strong> {selectedTime} น.
              </Typography>
              <Typography>
                <strong>ราคา:</strong> ฿{selectedServiceData?.price}
              </Typography>
            </Box>
          </Box>
        )
      default:
        return null
    }
  }

  if (bookingSuccess) {
    return (
      <Card>
        <CardContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            จองคิวสำเร็จ!
          </Alert>
          <Typography variant="h6" gutterBottom>
            ข้อมูลการจอง
          </Typography>
          <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 2, mb: 2 }}>
            <Typography>
              <strong>บริการ:</strong> {selectedServiceData?.name}
            </Typography>
            <Typography>
              <strong>วันที่:</strong> {selectedDate?.format('DD/MM/YYYY')}
            </Typography>
            <Typography>
              <strong>เวลา:</strong> {selectedTime} น.
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setBookingSuccess(false)
              setActiveStep(0)
              setSelectedService('')
              setSelectedDate(null)
              setSelectedTime('')
            }}
          >
            จองใหม่
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom textAlign="center">
          จองคิว
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 200, mb: 3 }}>{renderStepContent()}</Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            ย้อนกลับ
          </Button>
          <Button variant="contained" onClick={handleNext} disabled={!canProceed()}>
            {activeStep === steps.length - 1 ? 'ยืนยันการจอง' : 'ถัดไป'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default LiffBooking
