# 🏨 Spa Booking System via LINE Official Account

ระบบจองนัด + จัดการสมาชิกสำหรับสปา ผ่าน LINE Official Account

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LINE OA       │    │   Backend API   │    │   Admin Panel   │
│                 │    │                 │    │                 │
│ • Rich Menu     │◄──►│ • Node.js       │◄──►│ • React         │
│ • LIFF Pages    │    │ • NestJS/Express│    │ • Material-UI   │
│ • Messaging     │    │ • PostgreSQL    │    │ • Dashboard     │
│                 │    │ • Omise API     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

- `backend/` - Node.js API server + Database logic
- `frontend/` - React Admin Panel + LIFF pages
- `database/` - Schema, migrations, และ seed data
- `docs/` - Documentation และ API specs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- LINE Developers Account
- Omise Account

### Development
1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Database Setup**
   ```bash
   # ดู database/README.md สำหรับ setup instructions
   ```

## 🌐 Deployment URLs (Production)

- Backend API: `https://your-app.onrender.com`
- Admin Panel: `https://your-admin.vercel.app`
- LIFF App: `https://your-admin.vercel.app/liff`

## 📋 Features

### Admin Panel
- [ ] Dashboard (สถิติ, รายรับ)
- [ ] จัดการ Booking (ดู, แก้, ยกเลิก)
- [ ] จัดการสมาชิก
- [ ] จัดการบริการ/คอร์ส
- [ ] จัดการพนักงาน + ตารางเวร
- [ ] รายงานการชำระเงิน
- [ ] ตั้งค่าระบบ

### LINE Integration
- [ ] Rich Menu นำทาง
- [ ] LIFF - สมัครสมาชิก
- [ ] LIFF - จองนัด/คอร์ส
- [ ] LIFF - ดูนัดของฉัน
- [ ] แจ้งเตือนผ่าน LINE
- [ ] ยืนยันการจอง

### Payment
- [ ] ชำระผ่าน Omise (บัตร/QR)
- [ ] ติดตามสถานะการจ่าย
- [ ] Receipt/ใบเสร็จ

## 🔧 Tech Stack

### Frontend
- React 18 + TypeScript
- Material-UI (MUI) for Admin
- Tailwind CSS for LIFF
- Axios for API calls

### Backend  
- Node.js + TypeScript
- NestJS (เลือกได้: Express ธรรมดา)
- PostgreSQL + Prisma ORM
- JWT Authentication

### Deployment
- Backend: Render/Railway (Free Tier)
- Frontend: Vercel/Netlify (Free Tier)
- Database: Supabase/Neon (Free Tier)

### 3rd Party
- LINE Messaging API (Free)
- LINE LIFF (Free)
- Omise Payments (Fee per transaction)

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [LINE Integration Guide](docs/line-integration.md)
- [Deployment Guide](docs/deployment.md)

---
**เริ่มต้นด้วยการพัฒนา Backend ก่อน แล้วค่อย ๆ เพิ่ม Features ทีละส่วน**
