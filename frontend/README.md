# 🎨 Spa Booking System - Frontend

React + TypeScript + Material-UI สำหรับ Admin Panel และ LINE LIFF Pages

## 🚀 Quick Start

### 1. Installation
```bash
cd spa-booking-system/frontend

# ติดตั้ง dependencies
npm install

# Copy environment file
cp .env.example .env.local

# แก้ไข .env.local ให้เหมาะสม
nano .env.local
```

### 2. Development Server
```bash
# Development mode
npm run dev

# Type checking
npm run type-check
```

Frontend จะรันที่: **http://localhost:3001**

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── layout/          # Layout components
│   │   └── forms/           # Form components
│   ├── pages/
│   │   ├── admin/           # Admin panel pages
│   │   └── liff/            # LIFF pages for LINE users
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript type definitions
│   ├── assets/              # Static assets
│   ├── theme.ts             # Material-UI theme
│   └── main.tsx             # App entry point
├── public/                  # Static files
├── index.html               # HTML template
└── vite.config.ts          # Vite configuration
```

## 🎭 Application Routes

### Admin Panel (เว็บหลังบ้าน)
- `/admin/login` - เข้าสู่ระบบแอดมิน
- `/admin/dashboard` - หน้าแดชบอร์ด
- `/admin/bookings` - จัดการการจอง
- `/admin/users` - จัดการสมาชิก
- `/admin/services` - จัดการบริการ/คอร์ส
- `/admin/staff` - จัดการพนักงาน
- `/admin/payments` - รายการชำระเงิน
- `/admin/settings` - ตั้งค่าระบบ

### LIFF Pages (สำหรับลูกค้าใน LINE)
- `/liff/register` - สมัครสมาชิก
- `/liff/booking` - จองนัด/คอร์ส
- `/liff/my-bookings` - ดูนัดของฉัน
- `/liff/profile` - ข้อมูลส่วนตัว

## 🔧 Key Technologies

### Frontend Framework
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **React Router** - Routing

### UI Library
- **Material-UI (MUI)** - Component library
- **Emotion** - CSS-in-JS
- **Material Icons** - Icon set

### State Management
- **React Query** - Server state management
- **React Context** - Client state management

### Form Handling
- **React Hook Form** - Form library
- **Yup** - Validation schema

### LINE Integration
- **LINE LIFF SDK** - LINE Front-end Framework

### Other Libraries
- **Axios** - HTTP client
- **Day.js** - Date manipulation
- **Notistack** - Notifications
- **Recharts** - Charts for dashboard

## ⚙️ Environment Variables

ดูในไฟล์ `.env.example` สำหรับตัวแปรที่จำเป็น:

```bash
# Backend API
VITE_API_URL=http://localhost:3000/api/v1

# LINE LIFF
VITE_LIFF_APP_ID=your-liff-app-id

# Payment
VITE_OMISE_PUBLIC_KEY=your-omise-public-key
```

## 🎨 Theme & Styling

### Material-UI Theme
- **Primary Color**: เขียวสปา (#2E7D32)
- **Secondary Color**: เขียวอ่อน (#8BC34A)
- **Font**: Kanit (Thai) + Roboto (English)

### Responsive Design
- **Desktop**: Admin panel layout with sidebar
- **Mobile**: Mobile-first design for LIFF
- **Breakpoints**: MUI standard breakpoints

### Custom CSS Classes
```css
.admin-layout       /* Admin panel layout */
.liff-container     /* LIFF page container */
.status-pending     /* Booking status colors */
.fade-in           /* Animation classes */
```

## 🔗 API Integration

### Authentication
```typescript
// Admin authentication
const { isAuthenticated, login, logout } = useAuth()

// LINE user authentication  
const { isLoggedIn, lineUserId } = useLiff()
```

### API Calls
```typescript
// Using React Query
import { useQuery, useMutation } from '@tanstack/react-query'

// GET data
const { data, isLoading } = useQuery(['bookings'], fetchBookings)

// POST/PUT/DELETE data
const mutation = useMutation(createBooking)
```

## 📱 LIFF Development

### LIFF Configuration
1. สร้าง LIFF App ใน LINE Developers
2. ตั้ง Endpoint URL: `https://your-frontend.vercel.app/liff`
3. เพิ่ม LIFF App ID ใน environment variables

### LIFF Features
- **Auto Login** - เข้าสู่ระบบอัตโนมัติ
- **Profile Access** - ดึงข้อมูล LINE profile
- **Rich Menu Integration** - เชื่อมต่อ Rich Menu

## 🚀 Deployment

### Vercel (แนะนำ)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder to Netlify
```

### Environment Variables (Production)
ตั้งค่าใน hosting platform:
- `VITE_API_URL` - Backend URL
- `VITE_LIFF_APP_ID` - LIFF App ID  
- `VITE_OMISE_PUBLIC_KEY` - Omise Public Key

## 🧪 Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run type-check       # TypeScript checking

# Building
npm run build           # Production build
npm run preview         # Preview production build

# Code Quality
npm run lint            # ESLint checking
```

## 🎯 Features Checklist

### Admin Panel
- [ ] 🔐 Authentication & Authorization
- [ ] 📊 Dashboard with charts
- [ ] 📅 Booking management
- [ ] 👥 User management
- [ ] 🏷️ Service/course management
- [ ] 👨‍💼 Staff management
- [ ] 💳 Payment tracking
- [ ] ⚙️ System settings

### LIFF Pages
- [ ] 📝 User registration
- [ ] 📅 Service booking
- [ ] 📱 My bookings view
- [ ] 👤 Profile management
- [ ] 💳 Payment integration

### Responsive Design
- [ ] 📱 Mobile-first LIFF
- [ ] 💻 Desktop admin panel
- [ ] 🎨 Thai language support

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache
rm -rf node_modules dist
npm install

# Type errors
npm run type-check
```

### LIFF Issues
```bash
# Check LIFF configuration
console.log(window.liff)

# Verify LIFF App ID
echo $VITE_LIFF_APP_ID
```

---
**Next:** LINE Integration Setup
