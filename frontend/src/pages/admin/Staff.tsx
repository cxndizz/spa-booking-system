import { Box, Typography, Card, CardContent, Button } from '@mui/material'
import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'ชื่อพนักงาน', width: 150 },
  { field: 'position', headerName: 'ตำแหน่ง', width: 150 },
  { field: 'phone', headerName: 'เบอร์โทร', width: 130 },
  { field: 'specialties', headerName: 'ความชำนาญ', width: 200 },
  { field: 'status', headerName: 'สถานะ', width: 120 },
]

const rows: never[] = []

function AdminStaff() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          จัดการพนักงาน
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />}>
          เพิ่มพนักงาน
        </Button>
      </Box>

      <Card>
        <CardContent>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
            localeText={{
              noRowsLabel: 'ไม่มีข้อมูลพนักงาน',
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminStaff
