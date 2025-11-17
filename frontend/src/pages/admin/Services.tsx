import { Box, Typography, Card, CardContent, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'ชื่อบริการ', width: 200 },
  { field: 'duration', headerName: 'ระยะเวลา (นาที)', width: 150 },
  { field: 'price', headerName: 'ราคา (บาท)', width: 130 },
  { field: 'description', headerName: 'รายละเอียด', width: 250 },
]

const rows: never[] = []

function AdminServices() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          จัดการบริการ
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          เพิ่มบริการ
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
              noRowsLabel: 'ไม่มีข้อมูลบริการ',
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminServices
