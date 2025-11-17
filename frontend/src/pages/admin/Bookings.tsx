import { Box, Typography, Card, CardContent, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'customerName', headerName: 'ชื่อลูกค้า', width: 150 },
  { field: 'service', headerName: 'บริการ', width: 150 },
  { field: 'date', headerName: 'วันที่', width: 120 },
  { field: 'time', headerName: 'เวลา', width: 100 },
  { field: 'status', headerName: 'สถานะ', width: 120 },
]

const rows: never[] = []

function AdminBookings() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          จัดการการจอง
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          เพิ่มการจอง
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
              noRowsLabel: 'ไม่มีข้อมูลการจอง',
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminBookings
