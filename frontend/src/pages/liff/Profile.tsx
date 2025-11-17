import { Box, Card, CardContent, Typography, TextField, Button, Avatar, Divider } from '@mui/material'
import { Person as PersonIcon, Save as SaveIcon } from '@mui/icons-material'
import { useForm } from 'react-hook-form'

interface ProfileForm {
  name: string
  phone: string
  email: string
}

function LiffProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: 'ผู้ใช้ทดสอบ',
      phone: '0812345678',
      email: 'test@example.com',
    },
  })

  const onSubmit = (data: ProfileForm) => {
    console.log('Profile update:', data)
    // TODO: Implement profile update API call
  }

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            โปรไฟล์ของฉัน
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ข้อมูลส่วนตัว
          </Typography>
          <Divider sx={{ mb: 2 }} />

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
              label="อีเมล"
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
              startIcon={<SaveIcon />}
              sx={{ mt: 3 }}
            >
              บันทึกข้อมูล
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LiffProfile
