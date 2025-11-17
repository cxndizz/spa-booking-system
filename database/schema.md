# 🗄️ Database Schema Design

## Core Tables

### 1. users (สมาชิก/ลูกค้า)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_user_id VARCHAR(255) UNIQUE NOT NULL, -- จาก LINE API
  display_name VARCHAR(255),
  picture_url TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  
  -- Membership info
  membership_level ENUM('standard', 'silver', 'gold', 'platinum') DEFAULT 'standard',
  membership_since DATE DEFAULT CURRENT_DATE,
  total_spent DECIMAL(10,2) DEFAULT 0,
  points_balance INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. staff (พนักงาน)
```sql
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(255),
  
  -- Work info
  position ENUM('therapist', 'consultant', 'manager', 'admin'),
  specialties JSON, -- ["facial", "massage", "body_treatment"]
  hourly_rate DECIMAL(8,2),
  
  -- Schedule
  work_days JSON, -- ["monday", "tuesday", "wednesday"]
  work_start_time TIME, -- 09:00
  work_end_time TIME,   -- 18:00
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 3. services (บริการ/คอร์ส)
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category ENUM('facial', 'massage', 'body_treatment', 'package'),
  
  -- Pricing
  price DECIMAL(8,2) NOT NULL,
  member_price DECIMAL(8,2), -- ราคาสมาชิก
  
  -- Duration & Capacity
  duration_minutes INTEGER NOT NULL, -- 60, 90, 120
  max_participants INTEGER DEFAULT 1, -- คอร์สกลุ่ม = >1
  
  -- Requirements
  required_staff_count INTEGER DEFAULT 1,
  required_staff_specialties JSON, -- ["facial"] or ["massage", "body_treatment"]
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. bookings (การจอง)
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number VARCHAR(20) UNIQUE NOT NULL, -- SPA240001, SPA240002
  
  -- Customer
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Service
  service_id UUID NOT NULL REFERENCES services(id),
  service_name VARCHAR(255), -- เก็บไว้เผื่อ service เปลี่ยนชื่อ
  service_price DECIMAL(8,2), -- ราคาตอนจอง
  
  -- Schedule
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Staff assignment
  assigned_staff_ids JSON, -- ["staff-uuid-1", "staff-uuid-2"]
  assigned_staff_names JSON, -- ["คุณแอน", "คุณบิว"] เก็บเผื่อ staff เปลี่ยนชื่อ
  
  -- Status
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') DEFAULT 'pending',
  
  -- Payment
  total_amount DECIMAL(8,2) NOT NULL,
  paid_amount DECIMAL(8,2) DEFAULT 0,
  payment_status ENUM('pending', 'partial', 'paid', 'refunded') DEFAULT 'pending',
  
  -- Notes
  customer_notes TEXT,
  staff_notes TEXT,
  cancellation_reason TEXT,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_appointment_date (appointment_date),
  INDEX idx_appointment_datetime (appointment_date, appointment_time),
  INDEX idx_user_bookings (user_id, appointment_date),
  INDEX idx_status (status)
);
```

### 5. payments (การชำระเงิน)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Omise integration
  omise_charge_id VARCHAR(255), -- จาก Omise API
  omise_transaction_id VARCHAR(255),
  
  -- Payment info
  amount DECIMAL(8,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'THB',
  payment_method ENUM('credit_card', 'qr_code', 'bank_transfer', 'cash', 'points'),
  
  -- Status tracking
  status ENUM('pending', 'processing', 'success', 'failed', 'cancelled', 'refunded') DEFAULT 'pending',
  
  -- Details
  paid_at TIMESTAMP NULL,
  receipt_url TEXT,
  failure_reason TEXT,
  
  -- Omise webhook data
  omise_webhook_data JSON,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_booking_payments (booking_id),
  INDEX idx_omise_charge (omise_charge_id),
  INDEX idx_payment_status (status)
);
```

### 6. admin_users (ผู้ดูแลระบบ)
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Profile
  full_name VARCHAR(255),
  role ENUM('admin', 'manager', 'staff') DEFAULT 'staff',
  
  -- Permissions
  permissions JSON, -- ["bookings.read", "bookings.write", "users.read"]
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Support Tables

### 7. business_settings (ตั้งค่าระบบ)
```sql
CREATE TABLE business_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSON NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default settings
INSERT INTO business_settings (key, value, description) VALUES
('business_hours', '{"open": "09:00", "close": "20:00", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]}', 'ชั่วโมงเปิด-ปิด'),
('booking_advance_days', '30', 'จองล่วงหน้าได้กี่วัน'),
('booking_cancellation_hours', '24', 'ยกเลิกก่อนกี่ชั่วโมง'),
('line_bot_token', '""', 'LINE Bot Channel Access Token'),
('omise_public_key', '""', 'Omise Public Key'),
('omise_secret_key', '""', 'Omise Secret Key (Encrypted)');
```

### 8. booking_logs (ประวัติการเปลี่ยนแปลง)
```sql
CREATE TABLE booking_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  action ENUM('created', 'updated', 'cancelled', 'completed', 'payment_updated'),
  
  old_data JSON,
  new_data JSON,
  changed_by VARCHAR(100), -- 'system', 'admin:username', 'user:line_user_id'
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_booking_logs (booking_id, created_at)
);
```

## 🔍 Key Indexes for Performance

```sql
-- Booking queries (จอง + ค้นหา slot ว่าง)
CREATE INDEX idx_bookings_datetime_status ON bookings(appointment_date, appointment_time, status);
CREATE INDEX idx_bookings_staff_datetime ON bookings(assigned_staff_ids, appointment_date, appointment_time);

-- User queries
CREATE INDEX idx_users_line_id ON users(line_user_id);
CREATE INDEX idx_users_phone ON users(phone);

-- Payment queries
CREATE INDEX idx_payments_booking_status ON payments(booking_id, status);
CREATE INDEX idx_payments_created_status ON payments(created_at, status);
```

## 📊 Sample Queries

### หา slot ว่างในวันที่กำหนด
```sql
SELECT DISTINCT t.time_slot
FROM (
  -- Generate time slots
  SELECT TIME '09:00' + (n * INTERVAL '30 minutes') AS time_slot
  FROM generate_series(0, 21) n -- 9:00 - 18:30 (30 min intervals)
) t
WHERE t.time_slot NOT IN (
  SELECT appointment_time 
  FROM bookings 
  WHERE appointment_date = '2024-12-01' 
    AND status IN ('confirmed', 'in_progress')
    AND duration_minutes = 60 -- ระยะเวลาบริการที่เลือก
);
```

---
**Next Step:** สร้าง Backend API + เชื่อมต่อ Database
