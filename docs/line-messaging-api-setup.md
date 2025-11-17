# LINE Messaging API Setup Guide

คู่มือการตั้งค่า LINE Messaging API สำหรับระบบ Spa Booking System

## สารบัญ
1. [สร้าง LINE Messaging API Channel](#1-สร้าง-line-messaging-api-channel)
2. [ตั้งค่า Webhook](#2-ตั้งค่า-webhook)
3. [สร้าง Rich Menu](#3-สร้าง-rich-menu)
4. [ทดสอบ Bot](#4-ทดสอบ-bot)
5. [Production Deployment](#5-production-deployment)

---

## 1. สร้าง LINE Messaging API Channel

### Step 1: สมัคร LINE Developers Account

1. ไปที่ [LINE Developers Console](https://developers.line.biz/)
2. Log in ด้วย LINE account
3. สร้าง Provider ใหม่ (ชื่อบริษัท/ธุรกิจ)

### Step 2: สร้าง Messaging API Channel

1. เลือก Provider ที่สร้างไว้
2. คลิก **Create a Messaging API channel**
3. กรอกข้อมูล:
   - **Channel name**: ชื่อ Bot (จะแสดงใน LINE)
   - **Channel description**: คำอธิบาย Bot
   - **Category**: Business > Services
   - **Subcategory**: Beauty > Spa/Salon
   - **Email address**: อีเมลติดต่อ
   - **Privacy policy URL**: (optional)
   - **Terms of use URL**: (optional)

4. ยอมรับ Terms และสร้าง Channel

### Step 3: รับ Credentials

1. ไปที่ **Basic settings** tab:
   - Copy **Channel secret**

2. ไปที่ **Messaging API** tab:
   - Click **Issue** ที่ "Channel access token (long-lived)"
   - Copy **Channel access token**

3. บันทึกใน `.env` file:
   ```env
   LINE_CHANNEL_ACCESS_TOKEN="your-channel-access-token-here"
   LINE_CHANNEL_SECRET="your-channel-secret-here"
   ```

---

## 2. ตั้งค่า Webhook

### Development (Local Testing)

#### ใช้ ngrok

```bash
# 1. Install ngrok
npm install -g ngrok

# 2. Start backend server
cd backend
npm run start:dev

# 3. Start ngrok tunnel (new terminal)
ngrok http 3000

# Output:
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

#### ตั้งค่าใน LINE Console

1. ไปที่ **Messaging API** tab
2. Scroll ไปที่ **Webhook settings**
3. Click **Edit** และใส่:
   ```
   https://abc123.ngrok.io/webhooks/line
   ```
4. เปิด **Use webhook**
5. Click **Verify** เพื่อทดสอบ connection

#### ปิด Auto-reply

1. ที่ **LINE Official Account features** section
2. Click **Auto-reply messages** → **Edit**
3. ปิด **Auto-reply messages** (ให้เป็น Disabled)
4. ปิด **Greeting messages** (ให้เป็น Disabled)

> **สำคัญ:** ต้องปิด Auto-reply เพื่อให้ Bot ของเราตอบแทน

---

## 3. สร้าง Rich Menu

### Option 1: ใช้ Setup Script (แนะนำ)

```bash
cd backend

# สร้าง Rich Menu
npx ts-node scripts/setup-rich-menu.ts create

# Output:
# Created Rich Menu for registered users: richmenu-xxxx
# Created Rich Menu for guests: richmenu-yyyy
# Set default Rich Menu successfully
```

บันทึก Rich Menu IDs:
```env
LINE_RICH_MENU_REGISTERED="richmenu-xxxx"
LINE_RICH_MENU_GUEST="richmenu-yyyy"
```

### Option 2: สร้างผ่าน LINE Official Account Manager

1. ไปที่ [LINE Official Account Manager](https://manager.line.biz/)
2. เลือก Account
3. ไปที่ **Chat** > **Rich menu**
4. Click **Create**
5. ออกแบบ Rich Menu ด้วย built-in editor

### Rich Menu Layout ที่แนะนำ

```
┌─────────────────────────────────────────────┐
│                                             │
│  [จองบริการ]  [การจองของฉัน]   [ซื้อคอร์ส]    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│   [ดูบริการ]     [โปรไฟล์]     [ติดต่อเรา]    │
│                                             │
└─────────────────────────────────────────────┘
```

**ขนาดรูปภาพ:**
- Full: 2500 x 1686 pixels
- Half: 2500 x 843 pixels
- Format: JPEG หรือ PNG
- Max size: 1MB

### Upload Rich Menu Image

```bash
# ผ่าน API (ถ้ามีรูปภาพ)
npx ts-node scripts/setup-rich-menu.ts upload-image <richMenuId> <imagePath>
```

หรือผ่าน LINE Developers Console:
1. ไปที่ Bot Settings
2. Rich Menu > Upload Image

---

## 4. ทดสอบ Bot

### เพิ่ม Bot เป็นเพื่อน

1. ไปที่ **Messaging API** tab
2. Scan **QR code** ด้วย LINE app
3. เพิ่มเป็นเพื่อน

### ทดสอบ Features

1. **Welcome Message**
   - เมื่อเพิ่มเพื่อน ควรได้รับข้อความต้อนรับ
   - พร้อม Flex Message และปุ่ม "สมัครสมาชิก"

2. **Rich Menu**
   - กดปุ่มในเมนูด้านล่าง
   - ควรได้รับการตอบกลับตาม action

3. **Registration Flow**
   ```
   User: [กดปุ่ม สมัครสมาชิก]
   Bot: กรุณาพิมพ์หมายเลขโทรศัพท์
   User: 0812345678
   Bot: กรุณาพิมพ์อีเมล (หรือกด ข้าม)
   User: [กด ข้าม]
   Bot: สมัครสมาชิกสำเร็จ!
   ```

4. **Booking Flow**
   ```
   User: [กดปุ่ม จองบริการ]
   Bot: [แสดง Service Carousel]
   User: [เลือกบริการ]
   Bot: [แสดง Date Picker]
   User: [เลือกวันที่]
   Bot: [แสดง Time Slots]
   User: [เลือกเวลา]
   Bot: [แสดง Confirmation]
   User: [กด ยืนยัน]
   Bot: [Booking Confirmation Card]
   ```

5. **Text Commands**
   - พิมพ์ "จอง" → เริ่ม Booking Flow
   - พิมพ์ "บริการ" → แสดงรายการบริการ
   - พิมพ์ "การจอง" → แสดงประวัติการจอง
   - พิมพ์ "เมนู" → แสดง Main Menu

### Debug Logs

```bash
# Watch backend logs
cd backend
npm run start:dev

# Logs จะแสดง:
# Handling LINE event: message
# Postback from Uxxxxxxx: action=book_service
# Processed 1 LINE events
```

---

## 5. Production Deployment

### Deploy Backend

1. **Render/Railway/Heroku**
   ```bash
   # Set environment variables:
   LINE_CHANNEL_ACCESS_TOKEN=xxx
   LINE_CHANNEL_SECRET=xxx
   DATABASE_URL=xxx
   JWT_SECRET=xxx
   ```

2. **Update Webhook URL**
   - LINE Console > Webhook URL
   - ใส่ production URL: `https://your-api.onrender.com/webhooks/line`

### Security Checklist

- [ ] เปลี่ยน JWT_SECRET เป็น strong random string
- [ ] เปลี่ยน ADMIN_DEFAULT_PASSWORD
- [ ] ตรวจสอบ CORS settings
- [ ] Enable webhook signature verification (อยู่ใน code แล้ว)
- [ ] ใช้ HTTPS เท่านั้น

### Webhook Signature Verification

ระบบจะ verify signature อัตโนมัติ:

```typescript
// backend/src/webhooks/webhooks.controller.ts
// LINE Bot SDK จะตรวจสอบ x-line-signature header
```

### Rich Menu for Different Users

เมื่อผู้ใช้สมัครสมาชิกสำเร็จ ระบบจะ:
1. เปลี่ยน Rich Menu จาก Guest → Registered
2. แสดงเมนูที่มีฟีเจอร์มากขึ้น (จองบริการ, ดูประวัติ, โปรไฟล์)

```typescript
// ใน LineEventHandlerService
if (this.registeredRichMenuId) {
  await this.richMenuService.linkRichMenuToUser(
    userId,
    this.registeredRichMenuId,
  );
}
```

---

## Troubleshooting

### Bot ไม่ตอบ
1. ตรวจสอบ Webhook URL ถูกต้อง
2. ตรวจสอบ "Use webhook" เปิดอยู่
3. ตรวจสอบ Backend server ทำงานอยู่
4. ดู logs ใน backend console

### Rich Menu ไม่แสดง
1. ตรวจสอบว่า set default menu แล้ว
2. ลอง unfollow แล้ว follow ใหม่
3. ตรวจสอบ Rich Menu image upload แล้ว

### Webhook Verification Failed
1. ตรวจสอบ URL ถูกต้อง (ต้องเป็น HTTPS)
2. ตรวจสอบ server respond 200 OK
3. ตรวจสอบไม่มี authentication required

### ngrok Session Expired
1. ngrok free tier มี session timeout
2. Restart ngrok และ update webhook URL

---

## Resources

- [LINE Messaging API Documentation](https://developers.line.biz/en/docs/messaging-api/)
- [LINE Bot SDK for Node.js](https://github.com/line/line-bot-sdk-nodejs)
- [Flex Message Simulator](https://developers.line.biz/flex-simulator/)
- [Rich Menu Editor](https://developers.line.biz/en/docs/messaging-api/using-rich-menus/)

---

## Next Steps

1. ✅ ตั้งค่า LINE Messaging API Channel
2. ✅ Configure Webhook
3. ✅ Create Rich Menu
4. ✅ Test Bot Features
5. 🔲 Upload Rich Menu Images (design professionally)
6. 🔲 Add Push Notifications
7. 🔲 Integrate Payment in Chat
8. 🔲 Deploy to Production
