import { Box, Typography, Card, CardContent, Button } from '@mui/material'
import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'ชื่อ', width: 150 },
  { field: 'email', headerName: 'อีเมล', width: 200 },
  { field: 'phone', headerName: 'เบอร์โทร', width: 130 },
  { field: 'lineId', headerName: 'LINE ID', width: 150 },
  { field: 'createdAt', headerName: 'วันที่สมัคร', width: 120 },
]

const rows: never[] = []

function AdminUsers() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          จัดการลูกค้า
        </Typography>
        <Button variant="contained" startIcon={<PersonAddIcon />}>
          เพิ่มลูกค้า
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
              noRowsLabel: 'ไม่มีข้อมูลลูกค้า',
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminUsers
