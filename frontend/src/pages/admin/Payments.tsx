import { Box, Typography, Card, CardContent } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'bookingId', headerName: 'รหัสการจอง', width: 120 },
  { field: 'customerName', headerName: 'ชื่อลูกค้า', width: 150 },
  { field: 'amount', headerName: 'จำนวนเงิน (บาท)', width: 150 },
  { field: 'method', headerName: 'วิธีชำระ', width: 130 },
  { field: 'status', headerName: 'สถานะ', width: 120 },
  { field: 'date', headerName: 'วันที่', width: 120 },
]

const rows: never[] = []

function AdminPayments() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          การชำระเงิน
        </Typography>
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
              noRowsLabel: 'ไม่มีข้อมูลการชำระเงิน',
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminPayments
