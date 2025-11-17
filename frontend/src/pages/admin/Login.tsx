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
import { useAuth } from '../../hooks/useAuth'

interface LoginForm {
  email: string
  password: string
}

function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)

    try {
      // Call login API
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const result = await response.json()
      login(result.data.access_token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Spa Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            เข้าสู่ระบบจัดการสปา
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="อีเมล"
              type="email"
              margin="normal"
              {...register('email', {
                required: 'กรุณากรอกอีเมล',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'รูปแบบอีเมลไม่ถูกต้อง',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              fullWidth
              label="รหัสผ่าน"
              type="password"
              margin="normal"
              {...register('password', {
                required: 'กรุณากรอกรหัสผ่าน',
                minLength: {
                  value: 6,
                  message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminLogin
