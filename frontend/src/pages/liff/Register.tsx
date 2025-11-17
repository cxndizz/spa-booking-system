import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useLiff } from '../../hooks/useLiff'

interface RegisterFormData {
  firstName: string
  lastName: string
  phone: string
  email?: string
  birthDate?: string
}

const schema = yup.object({
  firstName: yup
    .string()
    .required('กรุณากรอกชื่อ')
    .min(2, 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'),
  lastName: yup
    .string()
    .required('กรุณากรอกนามสกุล')
    .min(2, 'นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร'),
  phone: yup
    .string()
    .required('กรุณากรอกเบอร์โทรศัพท์')
    .matches(/^0[0-9]{9}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)'),
  email: yup
    .string()
    .email('อีเมลไม่ถูกต้อง')
    .optional(),
  birthDate: yup
    .string()
    .optional(),
})

function Register() {
  const navigate = useNavigate()
  const { liffProfile, isLiffLoggedIn, liffLogin } = useLiff()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    // If LIFF profile is available, pre-fill some fields
    if (liffProfile) {
      const names = liffProfile.displayName.split(' ')
      if (names.length >= 2) {
        setValue('firstName', names[0])
        setValue('lastName', names.slice(1).join(' '))
      } else {
        setValue('firstName', liffProfile.displayName)
      }
    }
  }, [liffProfile, setValue])

  const onSubmit = async (data: RegisterFormData) => {
    if (!isLiffLoggedIn || !liffProfile) {
      setError('กรุณาเข้าสู่ระบบ LINE ก่อน')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/v1/liff/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          lineUserId: liffProfile.userId,
          lineDisplayName: liffProfile.displayName,
          linePictureUrl: liffProfile.pictureUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'การลงทะเบียนล้มเหลว')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/liff/booking')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLiffLoggedIn) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Typography variant="h6" gutterBottom>
          กรุณาเข้าสู่ระบบ LINE
        </Typography>
        <Button variant="contained" onClick={liffLogin} sx={{ mt: 2 }}>
          เข้าสู่ระบบ LINE
        </Button>
      </Box>
    )
  }

  if (success) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          ลงทะเบียนสำเร็จ! กำลังพาคุณไปยังหน้าจองคิว...
        </Alert>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            {liffProfile?.pictureUrl && (
              <Avatar
                src={liffProfile.pictureUrl}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
            )}
            <Typography variant="h5" component="h1" gutterBottom>
              ลงทะเบียนสมาชิก
            </Typography>
            <Typography variant="body2" color="text.secondary">
              กรอกข้อมูลเพื่อเริ่มใช้บริการ
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('firstName')}
              label="ชื่อ"
              fullWidth
              margin="normal"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />

            <TextField
              {...register('lastName')}
              label="นามสกุล"
              fullWidth
              margin="normal"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />

            <TextField
              {...register('phone')}
              label="เบอร์โทรศัพท์"
              fullWidth
              margin="normal"
              placeholder="0812345678"
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              {...register('email')}
              label="อีเมล (ไม่บังคับ)"
              fullWidth
              margin="normal"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              {...register('birthDate')}
              label="วันเกิด (ไม่บังคับ)"
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }}
              error={!!errors.birthDate}
              helperText={errors.birthDate?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              sx={{ mt: 3 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'ลงทะเบียน'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Register
