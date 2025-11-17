# 🚀 Getting Started - Spa Booking System

คู่มือเริ่มต้นการพัฒนาระบบจองนัดสปาผ่าน LINE OA แบบ Step-by-Step

## 📋 Overview

สิ่งที่เราได้สร้างมาแล้ว:
- ✅ **Backend API** (NestJS + TypeScript + Prisma + PostgreSQL)
- ✅ **Frontend** (React + TypeScript + Material-UI)
- ✅ **Database Schema** ครบถ้วนพร้อม relationships
- ✅ **Docker Environment** สำหรับ development
- ✅ **Authentication System** (Admin + LINE users)
- ✅ **LIFF Integration** structure

---

## 🎯 Phase 1: Local Development Setup

### Step 1: Prerequisites
```bash
# ตรวจสอบ Node.js version
node --version  # ต้อง v18+
npm --version

# ตรวจสอบ Docker (Optional แต่แนะนำ)
docker --version
docker-compose --version
```

### Step 2: Clone & Setup Project
```bash
# ไปยัง project directory
cd /home/claude/spa-booking-system

# ตรวจสอบไฟล์ที่สร้างมา
ls -la
# ควรเห็น: backend/ frontend/ database/ docs/ README.md docker-compose.yml
```

### Step 3: Database Setup (เลือกวิธีใดวิธีหนึ่ง)

#### ตัวเลือก A: ใช้ Docker (แนะนำ)
```bash
# Start PostgreSQL + Adminer
docker-compose up -d postgres adminer

# ตรวจสอบว่า database รัน
docker-compose ps

# เข้า Adminer ได้ที่: http://localhost:8080
# Server: postgres, Username: spauser, Password: spapassword
```

#### ตัวเลือก B: PostgreSQL ติดตั้งเอง
```bash
# สร้าง database
sudo -u postgres createdb spa_booking_db

# หรือใน psql
sudo -u postgres psql
CREATE DATABASE spa_booking_db;
CREATE USER spauser WITH PASSWORD 'spapassword';
GRANT ALL PRIVILEGES ON DATABASE spa_booking_db TO spauser;
\\q
```

### Step 4: Backend Setup
```bash
cd backend

# ติดตั้ง packages
npm install

# Setup environment
cp .env.example .env
nano .env  # แก้ไข DATABASE_URL และค่าอื่นๆ

# Generate Prisma client
npx prisma generate

# Apply database migrations  
npx prisma migrate deploy

# (Optional) Seed sample data
npm run db:seed

# Start development server
npm run start:dev
```

✅ **Backend จะรันที่:** http://localhost:3000
✅ **Health check:** http://localhost:3000/health

### Step 5: Frontend Setup
```bash
cd ../frontend

# ติดตั้ง packages
npm install

# Setup environment
cp .env.example .env.local
nano .env.local  # แก้ไข VITE_API_URL และค่าอื่นๆ

# Start development server
npm run dev
```

✅ **Frontend จะรันที่:** http://localhost:3001
✅ **Admin Panel:** http://localhost:3001/admin

---

## 🔗 Phase 2: LINE Integration Setup

### Step 1: LINE Developers Account
1. ไปที่ [LINE Developers](https://developers.line.biz/)
2. Login ด้วย LINE account
3. สร้าง **Provider** (ชื่อบริษัท/องค์กร)

### Step 2: สร้าง LINE Official Account
1. สร้าง **Channel** ใหม่ ประเภท **Messaging API**
2. กรอกข้อมูล:
   - Channel name: "ระบบจองนัด [ชื่อสปา]"
   - Channel description: "จองนัดและจัดการสมาชิก"
   - Category: "Beauty & Health"
3. เก็บ **Channel Access Token** และ **Channel Secret**

### Step 3: สร้าง LIFF App
1. ใน Channel เดิม ไปที่ **LIFF** tab
2. **Add LIFF app**:
   - LIFF app name: "SpaBooking"
   - Size: **Full**
   - Endpoint URL: `https://your-domain.vercel.app/liff`
   - Scope: `profile` และ `openid`
3. เก็บ **LIFF ID** ที่ได้

### Step 4: อัปเดต Environment Variables
```bash
# backend/.env
LINE_CHANNEL_ACCESS_TOKEN="your-channel-access-token"
LINE_CHANNEL_SECRET="your-channel-secret"

# frontend/.env.local  
VITE_LIFF_APP_ID="your-liff-id"
```

### Step 5: ตั้งค่า Webhook (ไว้ทำหลัง Deploy)
```bash
# Webhook URL จะเป็น:
https://your-backend.onrender.com/api/v1/webhooks/line
```

---

## 💳 Phase 3: Omise Payment Setup

### Step 1: Omise Account
1. สมัคร [Omise Account](https://www.omise.co/)
2. เข้า Dashboard ดู **API Keys**:
   - **Public Key** - สำหรับ frontend
   - **Secret Key** - สำหรับ backend

### Step 2: อัปเดต Environment Variables
```bash
# backend/.env
OMISE_PUBLIC_KEY="pkey_test_xxxxx"
OMISE_SECRET_KEY="skey_test_xxxxx"

# frontend/.env.local
VITE_OMISE_PUBLIC_KEY="pkey_test_xxxxx" 
```

### Step 3: ตั้งค่า Webhook (หลัง Deploy)
```bash
# Omise Webhook URL จะเป็น:
https://your-backend.onrender.com/api/v1/webhooks/omise
```

---

## 🚀 Phase 4: Deployment

### Backend - Deploy บน Render
1. ไปที่ [Render](https://render.com/)
2. **New Web Service** → Connect GitHub repo
3. Settings:
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm run start:prod`
   - **Environment**: Add ทุก variables จาก `.env`
4. **Deploy**

### Frontend - Deploy บน Vercel  
1. ไปที่ [Vercel](https://vercel.com/)
2. **Import** GitHub repo
3. Settings:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Environment Variables**: Add ทุก variables จาก `.env.local`
4. **Deploy**

### Database - ใช้ Neon
1. ไปที่ [Neon](https://neon.tech/)
2. สร้าง **Database** ใหม่
3. เก็บ **Connection URL**
4. อัปเดต `DATABASE_URL` ใน Render

---

## 🧪 Phase 5: Testing & Verification

### Step 1: Backend Health Check
```bash
curl https://your-backend.onrender.com/health
# ควรได้: {"status": "OK", ...}
```

### Step 2: Frontend Access
- **Admin Panel**: `https://your-frontend.vercel.app/admin`
- **LIFF**: `https://your-frontend.vercel.app/liff`

### Step 3: LINE Integration Test
1. เพิ่มเพื่อน LINE OA ที่สร้าง
2. ส่งข้อความทดสอบ
3. ทดสอบ Rich Menu (หลังสร้าง)

### Step 4: Payment Test
1. ใช้ Omise Test Cards
2. ทดสอบการจองและชำระเงิน

---

## 📚 Development Workflow

### การพัฒนาใหม่
```bash
# 1. Start local environment
docker-compose up -d postgres redis

# 2. Start backend
cd backend && npm run start:dev

# 3. Start frontend  
cd frontend && npm run dev

# 4. Open browser:
# - Admin: http://localhost:3001/admin
# - API: http://localhost:3000
# - DB: http://localhost:8080 (Adminer)
```

### การ Deploy changes
```bash
# Backend: Render auto-deploy เมื่อ push ไป GitHub
git add . && git commit -m "Update backend" && git push

# Frontend: Vercel auto-deploy เมื่อ push ไป GitHub  
git add . && git commit -m "Update frontend" && git push
```

---

## 🛠️ Next Steps - Feature Development

### 1. สร้าง Admin Pages
- [ ] Dashboard with charts
- [ ] Booking management  
- [ ] User management
- [ ] Service management
- [ ] Staff management
- [ ] Payment reports

### 2. สร้าง LIFF Pages
- [ ] User registration
- [ ] Service booking
- [ ] My bookings
- [ ] Profile management

### 3. ทำ LINE Integration  
- [ ] Rich Menu design
- [ ] Webhook handlers
- [ ] Messaging templates
- [ ] Push notifications

### 4. Payment Integration
- [ ] Omise charges
- [ ] Payment webhooks
- [ ] Receipt generation

---

## 📞 Support

หากมีปัญหาในการ setup:

1. **ตรวจสอบ logs**:
   ```bash
   # Backend logs
   docker-compose logs backend
   
   # Database connection  
   npx prisma db push
   ```

2. **Common issues**:
   - PORT already in use → `lsof -ti:3000` แล้ว `kill -9 <PID>`
   - Database connection → ตรวจสอบ `DATABASE_URL`
   - LIFF not working → ตรวจสอบ `VITE_LIFF_APP_ID`

3. **References**:
   - [NestJS Docs](https://docs.nestjs.com/)
   - [LINE Developers](https://developers.line.biz/en/docs/)
   - [Omise API Docs](https://www.omise.co/api-documentation)

---

🎉 **ยินดีด้วย! ตอนนี้คุณมีระบบ Spa Booking ที่พร้อมพัฒนาต่อแล้ว**
