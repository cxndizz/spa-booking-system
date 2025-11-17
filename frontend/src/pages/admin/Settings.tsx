import { Box, Typography, Card, CardContent, TextField, Button, Grid, Divider } from '@mui/material'
import { Save as SaveIcon } from '@mui/icons-material'

function AdminSettings() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        ตั้งค่าระบบ
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ข้อมูลร้าน
              </Typography>
              <TextField
                fullWidth
                label="ชื่อร้าน"
                defaultValue="My Spa"
                margin="normal"
              />
              <TextField
                fullWidth
                label="ที่อยู่"
                multiline
                rows={3}
                margin="normal"
              />
              <TextField
                fullWidth
                label="เบอร์โทรศัพท์"
                margin="normal"
              />
              <TextField
                fullWidth
                label="อีเมล"
                type="email"
                margin="normal"
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ mt: 2 }}
              >
                บันทึก
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                เวลาทำการ
              </Typography>
              <TextField
                fullWidth
                label="เวลาเปิด"
                type="time"
                defaultValue="09:00"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="เวลาปิด"
                type="time"
                defaultValue="20:00"
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                การแจ้งเตือน
              </Typography>
              <TextField
                fullWidth
                label="LINE Notify Token"
                margin="normal"
              />
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                sx={{ mt: 2 }}
              >
                บันทึก
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminSettings
