import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useForm } from 'react-hook-form'

interface RegisterForm {
  name: string
  phone: string
  email: string
}

function LiffRegister() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>()

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    setError(null)

    try {
      // TODO: Implement registration API call
      console.log('Register data:', data)
      navigate('/liff/booking')
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการลงทะเบียน')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom textAlign="center">
            ลงทะเบียน
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            กรอกข้อมูลเพื่อใช้บริการจองคิว
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="ชื่อ-นามสกุล"
              margin="normal"
              {...register('name', {
                required: 'กรุณากรอกชื่อ-นามสกุล',
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              fullWidth
              label="เบอร์โทรศัพท์"
              margin="normal"
              {...register('phone', {
                required: 'กรุณากรอกเบอร์โทรศัพท์',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก',
                },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              fullWidth
              label="อีเมล (ไม่บังคับ)"
              type="email"
              margin="normal"
              {...register('email', {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'รูปแบบอีเมลไม่ถูกต้อง',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'ลงทะเบียน'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LiffRegister
