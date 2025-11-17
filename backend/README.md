# 🏨 Spa Booking System - Backend API

Node.js + NestJS + PostgreSQL + Prisma API สำหรับระบบจองนัดและจัดการสมาชิกสปาผ่าน LINE Official Account

## 🚀 Quick Start

### 1. Prerequisites
```bash
# ติดตั้ง Node.js 18+
node --version
npm --version

# ติดตั้ง PostgreSQL (หรือใช้ Docker)
# หรือ
docker --version
```

### 2. Installation
```bash
# Clone และเข้าไป backend directory
cd spa-booking-system/backend

# ติดตั้ง dependencies
npm install

# Copy environment file
cp .env.example .env

# แก้ไข .env ให้เหมาะสม (database url, จิ๋มๆ)
nano .env
```

### 3. Database Setup

#### ตัวเลือก A: ใช้ Docker (แนะนำ)
```bash
# เริ่ม PostgreSQL + Redis + Adminer
docker-compose up -d postgres redis adminer

# Database จะรันที่:
# - PostgreSQL: localhost:5432
# - Adminer (Web UI): http://localhost:8080
```

#### ตัวเลือก B: PostgreSQL ตัวเอง
```bash
# สร้าง database
createdb spa_booking_db

# หรือใน psql
psql -U postgres
CREATE DATABASE spa_booking_db;
```

### 4. Prisma Migration
```bash
# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate deploy

# (Optional) Seed sample data
npm run db:seed
```

### 5. Run Development Server
```bash
# Development mode (auto-reload)
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

API จะรันที่: **http://localhost:3000**

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication (JWT, Admin login)
│   ├── users/             # Users management (LINE users)
│   ├── services/          # Spa services/courses
│   ├── bookings/          # Booking management
│   ├── staff/             # Staff management
│   ├── payments/          # Payment integration (Omise)
│   ├── admin/             # Admin panel APIs
│   ├── webhooks/          # LINE & Omise webhooks
│   ├── prisma/            # Database connection
│   └── common/            # Shared utilities (DTOs, Guards, etc.)
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Database migrations
│   └── seed.ts           # Sample data
├── docker-compose.yml     # Development environment
└── .env.example          # Environment variables template
```

## 🔑 Environment Variables

ดูในไฟล์ `.env.example` สำหรับตัวแปรที่จำเป็น:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/spa_booking_db"

# JWT
JWT_SECRET="your-secret-key"

# LINE API
LINE_CHANNEL_ACCESS_TOKEN="your-token"
LINE_CHANNEL_SECRET="your-secret"

# Omise
OMISE_PUBLIC_KEY="your-public-key"
OMISE_SECRET_KEY="your-secret-key"
```

## 🛠️ Development Commands

```bash
# Code formatting
npm run format

# Linting
npm run lint

# Testing
npm test
npm run test:watch
npm run test:cov

# Database
npm run migration:generate    # Generate new migration
npm run migration:deploy      # Apply migrations
npm run db:seed              # Seed sample data

# Production build
npm run build
```

## 🔗 API Endpoints

### Authentication
- `POST /api/v1/auth/admin/login` - Admin login
- `POST /api/v1/auth/admin/refresh` - Refresh token

### Users (LINE Users)
- `GET /api/v1/users` - Get users list
- `GET /api/v1/users/:id` - Get user detail
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

### Services
- `GET /api/v1/services` - Get services list
- `POST /api/v1/services` - Create service
- `PUT /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service

### Bookings
- `GET /api/v1/bookings` - Get bookings list
- `POST /api/v1/bookings` - Create booking
- `PUT /api/v1/bookings/:id` - Update booking
- `DELETE /api/v1/bookings/:id` - Cancel booking
- `GET /api/v1/bookings/available-slots` - Get available slots

### Payments
- `POST /api/v1/payments/create-charge` - Create Omise charge
- `GET /api/v1/payments/:bookingId` - Get payment status

### Webhooks
- `POST /webhooks/line` - LINE messaging webhook
- `POST /webhooks/omise` - Omise payment webhook

## 🐳 Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild services
docker-compose up --build
```

## 🚀 Deployment

### Render/Railway Deployment
```bash
# Build command
npm run build

# Start command  
npm run start:prod
```

### Environment Variables (Production)
จำเป็นต้องตั้งค่าใน hosting platform:
- `DATABASE_URL`
- `JWT_SECRET`
- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `OMISE_PUBLIC_KEY`
- `OMISE_SECRET_KEY`

## 🧪 Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Test specific file
npm test users.service.spec.ts
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [LINE Messaging API](https://developers.line.biz/en/docs/messaging-api/)
- [Omise API Documentation](https://www.omise.co/api-documentation)

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# ตรวจสอบ PostgreSQL
pg_isready -h localhost -p 5432

# ตรวจสอบ Prisma connection
npx prisma db push
```

### Port Already in Use
```bash
# หา process ที่ใช้ port 3000
lsof -ti:3000
kill -9 <PID>
```

---
**Next:** Setup LINE Integration + Admin Panel
