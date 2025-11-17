# 🚀 Getting Started - Spa Booking System

คู่มือเริ่มต้นการพัฒนาระบบจองนัดสปาผ่าน LINE Messaging API แบบ Step-by-Step

## 📋 Overview

สิ่งที่เราได้สร้างมาแล้ว:
- ✅ **Backend API** (NestJS + TypeScript + Prisma + PostgreSQL)
- ✅ **LINE Messaging API Integration** (@line/bot-sdk v8)
- ✅ **Rich Menu** Configuration และ Setup Scripts
- ✅ **Flex Message Templates** สำหรับ Services, Bookings, Profile
- ✅ **Conversation Flow Management** (Registration, Booking)
- ✅ **Webhook Handlers** สำหรับ LINE Events
- ✅ **Frontend Admin Panel** (React + TypeScript + Material-UI)
- ✅ **Database Schema** ครบถ้วนพร้อม relationships
- ✅ **Docker Environment** สำหรับ development
- ✅ **Authentication System** (Admin + LINE users)

---

## 🎯 Phase 1: Local Development Setup

### Step 1: Prerequisites
```bash
# ตรวจสอบ Node.js version
node --version  # ต้อง v18+
npm --version

# ตรวจสอบ Docker
docker --version
docker-compose --version
```

### Step 2: Clone & Setup Project
```bash
# ไปยัง project directory
cd /path/to/spa-booking-system

# ตรวจสอบไฟล์
ls -la
# ควรเห็น: backend/ frontend/ database/ docs/ README.md docker-compose.yml
```

### Step 3: Database Setup

#### ใช้ Docker (แนะนำ)
```bash
# Start PostgreSQL + Adminer
docker-compose up -d postgres adminer

# ตรวจสอบว่า database รัน
docker-compose ps

# เข้า Adminer ได้ที่: http://localhost:8080
# Server: postgres, Username: spauser, Password: spapassword
```

### Step 4: Backend Setup
```bash
cd backend

# ติดตั้ง packages
npm install

# Setup environment
cp .env .env.backup  # backup
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
nano .env.local  # แก้ไข VITE_API_URL

# Start development server
npm run dev
```

✅ **Frontend จะรันที่:** http://localhost:3001
✅ **Admin Panel:** http://localhost:3001/admin

---

## 🔗 Phase 2: LINE Messaging API Setup

### Step 1: LINE Developers Account
1. ไปที่ [LINE Developers](https://developers.line.biz/)
2. Login ด้วย LINE account
3. สร้าง **Provider** (ชื่อบริษัท/องค์กร)

### Step 2: สร้าง Messaging API Channel
1. สร้าง **Channel** ใหม่ ประเภท **Messaging API**
2. กรอกข้อมูล:
   - Channel name: "ระบบจองนัด [ชื่อสปา]"
   - Channel description: "จองนัดและจัดการสมาชิกผ่าน LINE"
   - Category: "Beauty" > "Spa/Salon"
3. เก็บ **Channel Access Token** และ **Channel Secret**

### Step 3: อัปเดต Environment Variables
```bash
# backend/.env
LINE_CHANNEL_ACCESS_TOKEN="your-channel-access-token"
LINE_CHANNEL_SECRET="your-channel-secret"
LINE_WEBHOOK_URL="https://your-backend.com/webhooks/line"
```

### Step 4: Setup Rich Menu
```bash
cd backend

# สร้าง Rich Menu
npx ts-node scripts/setup-rich-menu.ts create

# Output:
# Menu IDs:
#   Registered Users: richmenu-xxxxx
#   Guest Users:      richmenu-yyyyy
#
# IMPORTANT: Save these IDs in your .env file:
# LINE_RICH_MENU_REGISTERED=richmenu-xxxxx
# LINE_RICH_MENU_GUEST=richmenu-yyyyy
```

บันทึก Rich Menu IDs ใน `.env`:
```env
LINE_RICH_MENU_REGISTERED="richmenu-xxxxx"
LINE_RICH_MENU_GUEST="richmenu-yyyyy"
```

### Step 5: ตั้งค่า Webhook (Local Testing)
```bash
# ใช้ ngrok สำหรับ local testing
npm install -g ngrok
ngrok http 3000

# ngrok จะให้ URL เช่น: https://abc123.ngrok.io
# ไปที่ LINE Developers Console:
# Webhook URL: https://abc123.ngrok.io/webhooks/line
```

**สำคัญ:** ในLINE Console
- ✅ Enable "Use webhook"
- ❌ Disable "Auto-reply messages"
- ❌ Disable "Greeting messages"

### Step 6: Upload Rich Menu Images

สร้างรูปภาพ Rich Menu ขนาด 2500x1686 pixels โดยแบ่งเป็น grid 3x2:

```
┌─────────────┬─────────────┬─────────────┐
│  จองบริการ  │ การจองของฉัน │  ซื้อคอร์ส   │
├─────────────┼─────────────┼─────────────┤
│   ดูบริการ   │   โปรไฟล์    │  ติดต่อเรา   │
└─────────────┴─────────────┴─────────────┘
```

Upload ผ่าน:
1. LINE Developers Console > Bot Settings > Rich Menu
2. หรือใช้ API (ถ้ามี script)

---

## 💳 Phase 3: Omise Payment Setup (Optional)

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
OMISE_WEBHOOK_URL="https://your-backend.com/webhooks/omise"
```

---

## 🧪 Phase 4: Testing LINE Bot

### Test 1: Add Bot as Friend
1. ไปที่ LINE Console > Messaging API tab
2. Scan **QR code** ด้วย LINE app
3. เพิ่มเป็นเพื่อน

### Test 2: Welcome Message
- เมื่อเพิ่มเพื่อน ควรได้รับ Flex Message ต้อนรับ
- มีปุ่ม "สมัครสมาชิก" และ "ดูบริการทั้งหมด"

### Test 3: Registration Flow
```
1. กดปุ่ม "สมัครสมาชิก" หรือพิมพ์ "สมัคร"
2. Bot: กรุณาพิมพ์หมายเลขโทรศัพท์
3. User: 0812345678
4. Bot: กรุณาพิมพ์อีเมล (หรือกด "ข้าม")
5. User: กด "ข้าม"
6. Bot: สมัครสมาชิกสำเร็จ! 🎉
```

### Test 4: Booking Flow
```
1. กดปุ่ม "จองบริการ"
2. Bot: แสดง Service Carousel
3. User: เลือกบริการ (กดปุ่ม "จองบริการนี้")
4. Bot: แสดง Date Picker
5. User: เลือกวันที่
6. Bot: แสดง Time Slots (Quick Replies)
7. User: เลือกเวลา
8. Bot: แสดง Confirmation
9. User: กด "ยืนยัน"
10. Bot: Booking Confirmation Flex Message
```

### Test 5: Text Commands
- `สมัคร` - เริ่ม registration
- `จอง` - เริ่ม booking
- `บริการ` - ดูรายการบริการ
- `การจอง` - ดูประวัติการจอง
- `โปรไฟล์` - ดูข้อมูลส่วนตัว
- `เมนู` - แสดงเมนูหลัก
- `ยกเลิก` - ยกเลิกขั้นตอนปัจจุบัน

### Debug Logs
```bash
# ดู logs ที่ backend console
cd backend
npm run start:dev

# จะเห็น:
# Handling LINE event: message
# Postback from Uxxxxxxx: action=book_service
# Processed 1 LINE events
```

---

## 🚀 Phase 5: Production Deployment

### Backend - Deploy บน Render
1. ไปที่ [Render](https://render.com/)
2. **New Web Service** → Connect GitHub repo
3. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `npm run start:prod`
   - **Environment**: Add ทุก variables จาก `.env`
4. **Deploy**

### Frontend - Deploy บน Vercel
1. ไปที่ [Vercel](https://vercel.com/)
2. **Import** GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Environment Variables**: Add จาก `.env.local`
4. **Deploy**

### Database - ใช้ Neon/Supabase
1. ไปที่ [Neon](https://neon.tech/) หรือ [Supabase](https://supabase.com/)
2. สร้าง **Database** ใหม่
3. เก็บ **Connection URL**
4. อัปเดต `DATABASE_URL` ใน Render environment

### Update Webhook URLs
เมื่อ deploy แล้ว:
1. LINE Console > Webhook URL: `https://your-api.onrender.com/webhooks/line`
2. Omise Dashboard > Webhooks: `https://your-api.onrender.com/webhooks/omise`

---

## 📚 Development Workflow

### การพัฒนาใหม่
```bash
# 1. Start local environment
docker-compose up -d postgres redis

# 2. Start backend
cd backend && npm run start:dev

# 3. Start ngrok (สำหรับ LINE webhook)
ngrok http 3000

# 4. Start frontend
cd frontend && npm run dev

# 5. Open browser:
# - Admin: http://localhost:3001/admin
# - API: http://localhost:3000
# - DB: http://localhost:8080 (Adminer)

# 6. Update LINE Webhook URL with ngrok URL
```

### การ Deploy changes
```bash
# Git push จะ auto-deploy
git add .
git commit -m "feat: add new feature"
git push origin main

# Render: auto-deploy backend
# Vercel: auto-deploy frontend
```

---

## 🛠️ Next Steps - Feature Development

### 1. LINE Bot Enhancements
- [ ] Push Notifications สำหรับ booking reminders
- [ ] Payment integration ผ่าน chat
- [ ] Course package purchases
- [ ] Promotion/Coupon codes
- [ ] Multi-language support

### 2. Admin Panel Features
- [ ] Dashboard with statistics
- [ ] Booking management
- [ ] User management
- [ ] Service management
- [ ] Staff management
- [ ] Payment reports

### 3. Advanced Features
- [ ] Staff scheduling
- [ ] Loyalty points system
- [ ] Analytics & Reports
- [ ] Export to Excel/PDF

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── line/                    # LINE Integration
│   │   ├── services/
│   │   │   ├── line-client.service.ts       # LINE SDK client
│   │   │   ├── line-message.service.ts      # Message helpers
│   │   │   ├── line-rich-menu.service.ts    # Rich Menu management
│   │   │   ├── line-conversation.service.ts # State management
│   │   │   └── line-event-handler.service.ts # Event handlers
│   │   ├── templates/
│   │   │   └── flex-messages.ts # Flex Message templates
│   │   └── constants/
│   │       └── conversation-states.ts # States & Actions
│   ├── webhooks/                # Webhook handlers
│   ├── auth/                    # Authentication
│   ├── bookings/               # Booking logic
│   └── ...
├── scripts/
│   └── setup-rich-menu.ts      # Rich Menu CLI tool
└── prisma/
    └── schema.prisma           # Database schema
```

---

## 📞 Support & Troubleshooting

### Common Issues

1. **Bot ไม่ตอบ**
   - ตรวจสอบ Webhook URL ถูกต้อง
   - ตรวจสอบ "Use webhook" เปิดอยู่
   - ดู logs ว่า event มาถึง backend หรือไม่

2. **Rich Menu ไม่แสดง**
   - ลอง unfollow แล้ว follow ใหม่
   - ตรวจสอบว่า set default menu แล้ว
   - ตรวจสอบ menu image uploaded

3. **Database connection error**
   - ตรวจสอบ `DATABASE_URL` ถูกต้อง
   - ตรวจสอบ PostgreSQL รันอยู่

4. **ngrok session expired**
   - Restart ngrok
   - Update webhook URL ใหม่

### Useful Commands

```bash
# Check backend health
curl http://localhost:3000/health

# Reset database
cd backend
npx prisma migrate reset

# View database
npx prisma studio

# List Rich Menus
npx ts-node scripts/setup-rich-menu.ts list

# Cleanup Rich Menus
npx ts-node scripts/setup-rich-menu.ts cleanup
```

### References
- [LINE Messaging API Docs](https://developers.line.biz/en/docs/messaging-api/)
- [LINE Bot SDK Node.js](https://github.com/line/line-bot-sdk-nodejs)
- [Flex Message Simulator](https://developers.line.biz/flex-simulator/)
- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs)

---

🎉 **ยินดีด้วย! ตอนนี้คุณมีระบบ Spa Booking ที่ใช้ LINE Messaging API พร้อมใช้งานแล้ว**

ผู้ใช้สามารถ:
- สมัครสมาชิกผ่าน chat
- จองบริการด้วย Rich Menu และ Flex Messages
- ดูประวัติการจองและโปรไฟล์
- ใช้งานทุกอย่างได้โดยไม่ต้องออกจาก LINE app!
