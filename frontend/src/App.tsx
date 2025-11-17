import { Routes, Route, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Admin Pages
import AdminLayout from './components/layout/AdminLayout'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminBookings from './pages/admin/Bookings'
import AdminUsers from './pages/admin/Users'
import AdminServices from './pages/admin/Services'
import AdminStaff from './pages/admin/Staff'
import AdminPayments from './pages/admin/Payments'
import AdminSettings from './pages/admin/Settings'

// LIFF Pages (สำหรับลูกค้าใน LINE)
import LiffLayout from './components/layout/LiffLayout'
import LiffRegister from './pages/liff/Register'
import LiffBooking from './pages/liff/Booking'
import LiffMyBookings from './pages/liff/MyBookings'
import LiffProfile from './pages/liff/Profile'

// Common Pages
import NotFound from './pages/NotFound'
import LoadingPage from './components/common/LoadingPage'

// Hooks
import { useAuth } from './hooks/useAuth'
import { useLiff } from './hooks/useLiff'

function App() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { isLiff, isLiffReady } = useLiff()

  // Show loading while checking authentication or LIFF
  if (authLoading || (isLiff && !isLiffReady)) {
    return <LoadingPage />
  }

  return (
    <>
      <Helmet>
        <title>Spa Booking System</title>
        <meta name="description" content="ระบบจัดการการจองนัดสำหรับสปา" />
      </Helmet>

      <Routes>
        {/* LIFF Routes (สำหรับลูกค้าใน LINE) */}
        {isLiff ? (
          <Route path="/liff" element={<LiffLayout />}>
            <Route index element={<Navigate to="/liff/booking" replace />} />
            <Route path="register" element={<LiffRegister />} />
            <Route path="booking" element={<LiffBooking />} />
            <Route path="my-bookings" element={<LiffMyBookings />} />
            <Route path="profile" element={<LiffProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          <>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                isAuthenticated ? (
                  <AdminLayout />
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </>
        )}

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
