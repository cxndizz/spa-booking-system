# 🏨 Spa Booking System via LINE Messaging API

ระบบจองนัด + จัดการสมาชิกสำหรับสปา ผ่าน LINE Official Account โดยใช้ LINE Messaging API และ Rich Menu

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LINE OA       │    │   Backend API   │    │   Admin Panel   │
│                 │    │                 │    │                 │
│ • Rich Menu     │◄──►│ • NestJS        │◄──►│ • React         │
│ • Flex Messages │    │ • LINE Bot SDK  │    │ • Material-UI   │
│ • Quick Replies │    │ • PostgreSQL    │    │ • Dashboard     │
│ • Chatbot Flow  │    │ • Omise API     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
spa-booking-system/
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── line/           # LINE Messaging API Integration
│   │   │   ├── services/   # LINE Client, Messages, Rich Menu, Events
│   │   │   ├── templates/  # Flex Message Templates
│   │   │   └── constants/  # Conversation States, Postback Actions
│   │   ├── webhooks/       # LINE & Omise Webhooks
│   │   ├── auth/           # Authentication (Admin + LINE Users)
│   │   ├── bookings/       # Booking Management
│   │   ├── services/       # Spa Services/Courses
│   │   └── ...
│   ├── scripts/            # CLI Tools (Rich Menu Setup)
│   └── prisma/             # Database Schema & Migrations
├── frontend/               # React Admin Panel
│   └── src/
│       └── pages/admin/    # Admin Dashboard & Management
├── docs/                   # Documentation
└── database/               # Schema Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker (for local development)
- LINE Developers Account
- Omise Account (optional for payments)

### 1. Clone & Install

```bash
git clone <repository-url>
cd spa-booking-system

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Start PostgreSQL with Docker
docker-compose up -d postgres

# Run migrations
cd backend
npx prisma migrate deploy
npx prisma db seed
```

### 3. Configure LINE Integration

1. **Create LINE Messaging API Channel**
   - Go to [LINE Developers Console](https://developers.line.biz/)
   - Create a Provider
   - Create a Messaging API channel

2. **Get Credentials**
   - Copy Channel Secret
   - Issue Channel Access Token (long-lived)

3. **Update .env file**
   ```env
   LINE_CHANNEL_ACCESS_TOKEN="your-channel-access-token"
   LINE_CHANNEL_SECRET="your-channel-secret"
   LINE_WEBHOOK_URL="https://your-backend-url/webhooks/line"
   ```

4. **Setup Rich Menu**
   ```bash
   cd backend
   npx ts-node scripts/setup-rich-menu.ts create
   ```
   This will create:
   - Guest Menu (สมัคร, เข้าสู่ระบบ, ดูบริการ, ซื้อคอร์ส, โปรโมชั่น, ติดต่อเรา)
   - Member Menu (จองบริการ, การจองของฉัน, ซื้อคอร์ส, ดูบริการ, โปรไฟล์, ติดต่อเรา)

5. **Configure Webhook URL**
   - In LINE Developers Console, set Webhook URL
   - Enable "Use webhook"
   - Disable "Auto-reply messages"

### 4. Start Development

```bash
# Backend (port 3000)
cd backend
npm run start:dev

# Frontend (port 3001)
cd frontend
npm run dev
```

### 5. Test Bot Locally (ngrok)

```bash
# Install ngrok
npm install -g ngrok

# Expose backend
ngrok http 3000

# Update webhook URL in LINE Console with ngrok URL
# Example: https://abc123.ngrok.io/webhooks/line
```

## 🤖 LINE Bot Features

### Rich Menu Navigation
```
┌─────────────┬─────────────┬─────────────┐
│  จองบริการ  │ การจองของฉัน │  ซื้อคอร์ส   │
├─────────────┼─────────────┼─────────────┤
│   ดูบริการ   │   โปรไฟล์    │  ติดต่อเรา   │
└─────────────┴─────────────┴─────────────┘
```

### Conversation Flows

1. **Registration Flow**
   - User clicks "สมัครสมาชิก"
   - Bot asks for phone number
   - Bot asks for email (optional)
   - Registration complete with confirmation

2. **Booking Flow**
   - User clicks "จองบริการ"
   - Bot shows service carousel (Flex Messages)
   - User selects service
   - User picks date (DatePicker)
   - User picks time (Quick Replies)
   - Confirmation with booking details
   - Booking created with confirmation message

3. **Profile & History**
   - View user profile with membership info
   - See all bookings in carousel format
   - Check points balance and membership level

### Message Types Used
- **Text Messages** - Simple responses with Quick Replies
- **Flex Messages** - Rich formatted cards for services, bookings, profile
- **Carousel** - Multiple service cards to swipe
- **Quick Reply** - Buttons for quick actions (dates, times, confirmations)
- **Postback Actions** - Handle menu button clicks

## 📋 Features

### LINE Chatbot
- [x] Rich Menu with 6 action buttons
- [x] User registration via conversation
- [x] Service booking with date/time picker
- [x] View bookings history
- [x] User profile management
- [x] Flex Message templates
- [x] Conversation state management
- [ ] Push notifications for reminders
- [ ] Payment integration in chat
- [ ] Course package purchases

### Admin Panel
- [x] Admin authentication (JWT)
- [ ] Dashboard with statistics
- [ ] Booking management
- [ ] Service/Course management
- [ ] Staff management
- [ ] User management
- [ ] Payment reports
- [ ] System settings

### Backend API
- [x] LINE Messaging API integration
- [x] Webhook handlers
- [x] User CRUD operations
- [x] Booking system
- [x] Service management
- [x] Payment processing (Omise)
- [x] Authentication (Admin + LINE Users)

## 🔧 Tech Stack

### Backend
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **LINE Integration:** @line/bot-sdk v8
- **Authentication:** JWT + Passport.js
- **Payments:** Omise

### Frontend (Admin Panel)
- **Framework:** React 18 + TypeScript
- **UI Library:** Material-UI v5
- **State Management:** TanStack Query
- **Forms:** React Hook Form + Yup

### Development Tools
- Docker Compose (PostgreSQL, Redis, Adminer)
- ngrok (Local webhook testing)
- Prisma Studio (Database GUI)

## 📱 LINE Commands

Users can type these commands in chat:
- `สมัคร` / `register` - Start registration
- `จอง` / `book` - Start booking
- `บริการ` / `service` - View services
- `การจอง` / `my booking` - View my bookings
- `โปรไฟล์` / `profile` - View profile
- `เมนู` / `menu` - Show main menu
- `ยกเลิก` / `cancel` - Cancel current operation

## 🌐 Deployment

### Backend (Render/Railway)
```bash
# Build
npm run build

# Start
npm run start:prod

# Environment variables required:
# - DATABASE_URL
# - LINE_CHANNEL_ACCESS_TOKEN
# - LINE_CHANNEL_SECRET
# - JWT_SECRET
```

### Frontend (Vercel)
```bash
# Build
npm run build

# Environment variables:
# - VITE_API_URL (Backend API URL)
```

### Database (Supabase/Neon)
- Use managed PostgreSQL service
- Run Prisma migrations on deploy

## 📚 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [LINE Integration Setup](docs/line-messaging-api-setup.md)
- [Database Schema](database/schema.md)
- [Development Roadmap](docs/roadmap.md)

## 🔒 Security

- JWT authentication for admin panel
- LINE webhook signature verification
- Encrypted credentials in production
- Rate limiting on API endpoints
- Input validation with class-validator

## 📈 Future Enhancements

- Multi-language support (EN/TH)
- LINE Push notifications
- Loyalty points system
- Staff scheduling
- Advanced analytics
- Mobile admin app
- AI-powered chatbot responses

---

**Built with LINE Messaging API for seamless customer experience directly in LINE chat**
