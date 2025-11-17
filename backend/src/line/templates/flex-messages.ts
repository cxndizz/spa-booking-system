import { FlexMessage, FlexBubble, FlexCarousel } from '@line/bot-sdk';

// Service card for carousel
export function createServiceCard(service: {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  memberPrice?: number;
  durationMinutes: number;
  imageUrl?: string;
}): FlexBubble {
  const priceText =
    service.memberPrice && service.memberPrice < service.price
      ? `฿${service.memberPrice} (สมาชิก) / ฿${service.price}`
      : `฿${service.price}`;

  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url:
        service.imageUrl ||
        'https://via.placeholder.com/1040x585/4A90E2/FFFFFF?text=Spa+Service',
      size: 'full',
      aspectRatio: '20:13',
      aspectMode: 'cover',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: service.name,
          weight: 'bold',
          size: 'lg',
          wrap: true,
        },
        {
          type: 'box',
          layout: 'baseline',
          margin: 'md',
          contents: [
            {
              type: 'text',
              text: service.category,
              size: 'sm',
              color: '#999999',
            },
          ],
        },
        {
          type: 'text',
          text: service.description || 'บริการสปาคุณภาพ',
          size: 'sm',
          color: '#666666',
          wrap: true,
          margin: 'md',
        },
        {
          type: 'separator',
          margin: 'lg',
        },
        {
          type: 'box',
          layout: 'vertical',
          margin: 'lg',
          spacing: 'sm',
          contents: [
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'ราคา',
                  size: 'sm',
                  color: '#999999',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: priceText,
                  size: 'sm',
                  color: '#333333',
                  flex: 3,
                  wrap: true,
                },
              ],
            },
            {
              type: 'box',
              layout: 'baseline',
              contents: [
                {
                  type: 'text',
                  text: 'เวลา',
                  size: 'sm',
                  color: '#999999',
                  flex: 1,
                },
                {
                  type: 'text',
                  text: `${service.durationMinutes} นาที`,
                  size: 'sm',
                  color: '#333333',
                  flex: 3,
                },
              ],
            },
          ],
        },
      ],
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          height: 'sm',
          action: {
            type: 'postback',
            label: 'จองบริการนี้',
            data: `action=select_service&serviceId=${service.id}`,
            displayText: `จอง ${service.name}`,
          },
        },
      ],
    },
  };
}

// Services carousel message
export function createServicesCarousel(services: any[]): FlexMessage {
  const bubbles = services.slice(0, 10).map(createServiceCard);

  return {
    type: 'flex',
    altText: 'บริการสปาของเรา',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

// Booking confirmation message
export function createBookingConfirmation(booking: {
  bookingNumber: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  durationMinutes: number;
  totalAmount: number;
  status: string;
}): FlexMessage {
  return {
    type: 'flex',
    altText: `การจองหมายเลข ${booking.bookingNumber}`,
    contents: {
      type: 'bubble',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'การจองสำเร็จ',
            weight: 'bold',
            size: 'xl',
            color: '#27ACB2',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `หมายเลขการจอง: ${booking.bookingNumber}`,
            weight: 'bold',
            size: 'md',
            margin: 'md',
          },
          {
            type: 'separator',
            margin: 'lg',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'บริการ',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: booking.serviceName,
                    size: 'sm',
                    color: '#333333',
                    flex: 4,
                    wrap: true,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'วันที่',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: booking.appointmentDate,
                    size: 'sm',
                    color: '#333333',
                    flex: 4,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'เวลา',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: booking.appointmentTime,
                    size: 'sm',
                    color: '#333333',
                    flex: 4,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'ระยะเวลา',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: `${booking.durationMinutes} นาที`,
                    size: 'sm',
                    color: '#333333',
                    flex: 4,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'ยอดรวม',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: `฿${booking.totalAmount}`,
                    size: 'sm',
                    color: '#27ACB2',
                    weight: 'bold',
                    flex: 4,
                  },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'secondary',
            height: 'sm',
            action: {
              type: 'postback',
              label: 'ดูการจองทั้งหมด',
              data: 'action=my_bookings',
              displayText: 'ดูการจองของฉัน',
            },
          },
        ],
      },
    },
  };
}

// User bookings list
interface BookingWithService {
  id: string;
  bookingNumber: string;
  serviceName: string;
  appointmentDate: Date;
  appointmentTime: string;
  status: string;
  service?: { name: string };
}

export function createBookingsList(bookings: BookingWithService[]): FlexMessage {
  if (bookings.length === 0) {
    return {
      type: 'flex',
      altText: 'ไม่มีการจอง',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'ยังไม่มีการจอง',
              weight: 'bold',
              size: 'lg',
              align: 'center',
            },
            {
              type: 'text',
              text: 'คุณยังไม่มีประวัติการจองบริการ',
              size: 'sm',
              color: '#999999',
              align: 'center',
              margin: 'md',
            },
          ],
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              style: 'primary',
              action: {
                type: 'postback',
                label: 'จองบริการ',
                data: 'action=book_service',
                displayText: 'จองบริการสปา',
              },
            },
          ],
        },
      },
    };
  }

  const bubbles: FlexBubble[] = bookings.slice(0, 10).map((booking) => {
    const statusColor = getStatusColor(booking.status);
    const statusText = getStatusText(booking.status);
    const serviceName = booking.serviceName || booking.service?.name || 'ไม่ระบุบริการ';

    const bubble: FlexBubble = {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: serviceName,
            weight: 'bold',
            size: 'md',
            wrap: true,
          },
          {
            type: 'text',
            text: `#${booking.bookingNumber}`,
            size: 'xs',
            color: '#999999',
            margin: 'sm',
          },
          {
            type: 'box',
            layout: 'baseline',
            margin: 'md',
            contents: [
              {
                type: 'text',
                text: 'สถานะ',
                size: 'sm',
                color: '#999999',
                flex: 2,
              },
              {
                type: 'text',
                text: statusText,
                size: 'sm',
                color: statusColor,
                weight: 'bold',
                flex: 3,
              },
            ],
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: 'วันที่',
                size: 'sm',
                color: '#999999',
                flex: 2,
              },
              {
                type: 'text',
                text: new Date(booking.appointmentDate).toLocaleDateString(
                  'th-TH',
                ),
                size: 'sm',
                color: '#333333',
                flex: 3,
              },
            ],
          },
          {
            type: 'box',
            layout: 'baseline',
            contents: [
              {
                type: 'text',
                text: 'เวลา',
                size: 'sm',
                color: '#999999',
                flex: 2,
              },
              {
                type: 'text',
                text: booking.appointmentTime,
                size: 'sm',
                color: '#333333',
                flex: 3,
              },
            ],
          },
        ],
      },
    };
    return bubble;
  });

  return {
    type: 'flex',
    altText: 'การจองของคุณ',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}

// User profile message
export function createUserProfile(user: {
  displayName: string;
  phone?: string;
  email?: string;
  membershipLevel: string;
  totalSpent: number;
  pointsBalance: number;
}): FlexMessage {
  return {
    type: 'flex',
    altText: 'โปรไฟล์ของคุณ',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'โปรไฟล์ของฉัน',
            weight: 'bold',
            size: 'xl',
            color: '#27ACB2',
          },
          {
            type: 'separator',
            margin: 'lg',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            spacing: 'md',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'ชื่อ',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: user.displayName,
                    size: 'sm',
                    color: '#333333',
                    flex: 4,
                    wrap: true,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'เบอร์โทร',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: user.phone || 'ยังไม่ได้ระบุ',
                    size: 'sm',
                    color: '#333333',
                    flex: 4,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'อีเมล',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: user.email || 'ยังไม่ได้ระบุ',
                    size: 'sm',
                    color: '#333333',
                    flex: 4,
                    wrap: true,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'ระดับสมาชิก',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: getMembershipText(user.membershipLevel),
                    size: 'sm',
                    color: '#27ACB2',
                    weight: 'bold',
                    flex: 4,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                contents: [
                  {
                    type: 'text',
                    text: 'แต้มสะสม',
                    size: 'sm',
                    color: '#999999',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: `${user.pointsBalance} แต้ม`,
                    size: 'sm',
                    color: '#FF6B6B',
                    weight: 'bold',
                    flex: 4,
                  },
                ],
              },
            ],
          },
        ],
      },
      footer: {
        type: 'box',
        layout: 'vertical',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'postback',
              label: 'แก้ไขข้อมูล',
              data: 'action=edit_profile',
              displayText: 'แก้ไขข้อมูลส่วนตัว',
            },
          },
        ],
      },
    },
  };
}

// Helper functions
function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return '#FFA500';
    case 'CONFIRMED':
      return '#27ACB2';
    case 'IN_PROGRESS':
      return '#4A90E2';
    case 'COMPLETED':
      return '#2ECC71';
    case 'CANCELLED':
      return '#E74C3C';
    case 'NO_SHOW':
      return '#95A5A6';
    default:
      return '#999999';
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'รอยืนยัน';
    case 'CONFIRMED':
      return 'ยืนยันแล้ว';
    case 'IN_PROGRESS':
      return 'กำลังดำเนินการ';
    case 'COMPLETED':
      return 'เสร็จสิ้น';
    case 'CANCELLED':
      return 'ยกเลิก';
    case 'NO_SHOW':
      return 'ไม่มา';
    default:
      return status;
  }
}

function getMembershipText(level: string): string {
  switch (level) {
    case 'STANDARD':
      return 'สมาชิกทั่วไป';
    case 'SILVER':
      return 'สมาชิก Silver';
    case 'GOLD':
      return 'สมาชิก Gold';
    case 'PLATINUM':
      return 'สมาชิก Platinum';
    default:
      return level;
  }
}
