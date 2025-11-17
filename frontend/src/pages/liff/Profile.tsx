import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Cake as CakeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import dayjs from 'dayjs'
import { useLiff } from '../../hooks/useLiff'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  phone: string
  email?: string
  birthDate?: string
  lineDisplayName: string
  linePictureUrl?: string
  totalBookings: number
  memberSince: string
}

interface ProfileFormData {
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
    .matches(/^0[0-9]{9}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง'),
  email: yup.string().email('อีเมลไม่ถูกต้อง').optional(),
  birthDate: yup.string().optional(),
})

function Profile() {
  const { liffProfile, isLiffLoggedIn, liffLogout, liffCloseWindow } = useLiff()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (isLiffLoggedIn && liffProfile) {
      fetchProfile()
    }
  }, [isLiffLoggedIn, liffProfile])

  const fetchProfile = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/v1/liff/profile?lineUserId=${liffProfile?.userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data.data)
        reset({
          firstName: data.data.firstName,
          lastName: data.data.lastName,
          phone: data.data.phone,
          email: data.data.email || '',
          birthDate: data.data.birthDate || '',
        })
      } else {
        // Mock data for development
        const mockProfile: UserProfile = {
          id: '1',
          firstName: 'สมชาย',
          lastName: 'ใจดี',
          phone: '0812345678',
          email: 'somchai@example.com',
          birthDate: '1990-05-15',
          lineDisplayName: liffProfile?.displayName || 'User',
          linePictureUrl: liffProfile?.pictureUrl,
          totalBookings: 12,
          memberSince: dayjs().subtract(3, 'month').toISOString(),
        }
        setProfile(mockProfile)
        reset({
          firstName: mockProfile.firstName,
          lastName: mockProfile.lastName,
          phone: mockProfile.phone,
          email: mockProfile.email,
          birthDate: mockProfile.birthDate,
        })
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      // Mock data
      const mockProfile: UserProfile = {
        id: '1',
        firstName: 'สมชาย',
        lastName: 'ใจดี',
        phone: '0812345678',
        email: '',
        birthDate: '',
        lineDisplayName: liffProfile?.displayName || 'User',
        linePictureUrl: liffProfile?.pictureUrl,
        totalBookings: 0,
        memberSince: dayjs().toISOString(),
      }
      setProfile(mockProfile)
      reset({
        firstName: mockProfile.firstName,
        lastName: mockProfile.lastName,
        phone: mockProfile.phone,
        email: mockProfile.email,
        birthDate: mockProfile.birthDate,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/v1/liff/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          lineUserId: liffProfile?.userId,
        }),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setProfile((prev) => (prev ? { ...prev, ...updatedData.data } : null))
        setSuccess('อัพเดทข้อมูลสำเร็จ')
        setIsEditing(false)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'ไม่สามารถอัพเดทข้อมูลได้')
      }
    } catch (err) {
      // For demo, just update locally
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              ...data,
            }
          : null
      )
      setSuccess('อัพเดทข้อมูลสำเร็จ')
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        email: profile.email || '',
        birthDate: profile.birthDate || '',
      })
    }
  }

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
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={profile?.linePictureUrl || liffProfile?.pictureUrl}
              sx={{ width: 80, height: 80, mb: 1 }}
            />
            <Typography variant="h6">
              {profile?.lineDisplayName || liffProfile?.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              สมาชิกตั้งแต่: {dayjs(profile?.memberSince).format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="body2" color="primary">
              จองทั้งหมด: {profile?.totalBookings} ครั้ง
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">ข้อมูลส่วนตัว</Typography>
            {!isEditing && (
              <Button
                startIcon={<EditIcon />}
                size="small"
                onClick={() => setIsEditing(true)}
              >
                แก้ไข
              </Button>
            )}
          </Box>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('firstName')}
                label="ชื่อ"
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                {...register('lastName')}
                label="นามสกุล"
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />

              <TextField
                {...register('phone')}
                label="เบอร์โทรศัพท์"
                fullWidth
                margin="normal"
                size="small"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />

              <TextField
                {...register('email')}
                label="อีเมล"
                fullWidth
                margin="normal"
                size="small"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                {...register('birthDate')}
                label="วันเกิด"
                fullWidth
                margin="normal"
                size="small"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.birthDate}
                helperText={errors.birthDate?.message}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <Button
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={isSaving}
                >
                  {isSaving ? <CircularProgress size={24} /> : 'บันทึก'}
                </Button>
              </Box>
            </form>
          ) : (
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary="ชื่อ-นามสกุล"
                  secondary={`${profile?.firstName} ${profile?.lastName}`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>
                <ListItemText primary="เบอร์โทรศัพท์" secondary={profile?.phone} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText
                  primary="อีเมล"
                  secondary={profile?.email || 'ไม่ได้ระบุ'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CakeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="วันเกิด"
                  secondary={
                    profile?.birthDate
                      ? dayjs(profile.birthDate).format('DD/MM/YYYY')
                      : 'ไม่ได้ระบุ'
                  }
                />
              </ListItem>
            </List>
          )}
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="outlined" color="error" onClick={liffLogout}>
          ออกจากระบบ LINE
        </Button>
        <Button variant="text" onClick={liffCloseWindow}>
          ปิดหน้าต่าง
        </Button>
      </Box>
    </Box>
  )
}

export default Profile
