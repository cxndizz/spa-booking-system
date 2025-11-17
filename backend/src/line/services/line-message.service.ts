import { Injectable } from '@nestjs/common';
import { LineClientService } from './line-client.service';
import {
  FlexMessage,
  TextMessage,
  QuickReply,
  QuickReplyItem,
} from '@line/bot-sdk';

@Injectable()
export class LineMessageService {
  constructor(private lineClient: LineClientService) {}

  // Send reply message to user
  async replyMessage(replyToken: string, messages: any[]): Promise<void> {
    try {
      await this.lineClient.getClient().replyMessage({
        replyToken,
        messages,
      });
    } catch (error) {
      console.error('Error sending reply message:', error);
      throw error;
    }
  }

  // Send push message to user
  async pushMessage(userId: string, messages: any[]): Promise<void> {
    try {
      await this.lineClient.getClient().pushMessage({
        to: userId,
        messages,
      });
    } catch (error) {
      console.error('Error sending push message:', error);
      throw error;
    }
  }

  // Send text message with optional quick replies
  createTextMessage(text: string, quickReply?: QuickReply): TextMessage {
    const message: TextMessage = {
      type: 'text',
      text,
    };
    if (quickReply) {
      message.quickReply = quickReply;
    }
    return message;
  }

  // Create quick reply items
  createQuickReplyItem(
    label: string,
    data: string,
    displayText?: string,
  ): QuickReplyItem {
    return {
      type: 'action',
      action: {
        type: 'postback',
        label,
        data,
        displayText: displayText || label,
      },
    };
  }

  // Create date picker quick reply
  createDatePickerQuickReply(
    label: string,
    data: string,
    mode: 'date' | 'time' | 'datetime' = 'date',
    initial?: string,
    min?: string,
    max?: string,
  ): QuickReplyItem {
    return {
      type: 'action',
      action: {
        type: 'datetimepicker',
        label,
        data,
        mode,
        initial,
        min,
        max,
      },
    };
  }

  // Get user profile from LINE
  async getUserProfile(userId: string) {
    try {
      return await this.lineClient.getClient().getProfile(userId);
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Welcome message for new users
  createWelcomeMessage(displayName: string): FlexMessage {
    return {
      type: 'flex',
      altText: `ยินดีต้อนรับ ${displayName}`,
      contents: {
        type: 'bubble',
        hero: {
          type: 'image',
          url: 'https://via.placeholder.com/1040x585/4A90E2/FFFFFF?text=Welcome+to+Spa',
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
              text: `ยินดีต้อนรับ ${displayName}`,
              weight: 'bold',
              size: 'xl',
              wrap: true,
            },
            {
              type: 'text',
              text: 'ขอบคุณที่เพิ่มเพื่อนกับเรา! เริ่มต้นใช้งานได้เลย',
              size: 'md',
              wrap: true,
              margin: 'md',
              color: '#666666',
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
                  type: 'text',
                  text: 'สิ่งที่คุณสามารถทำได้:',
                  weight: 'bold',
                  size: 'sm',
                },
                {
                  type: 'text',
                  text: '• สมัครสมาชิก',
                  size: 'sm',
                  margin: 'sm',
                },
                {
                  type: 'text',
                  text: '• จองบริการสปา',
                  size: 'sm',
                },
                {
                  type: 'text',
                  text: '• ซื้อคอร์สสปา',
                  size: 'sm',
                },
                {
                  type: 'text',
                  text: '• ดูประวัติการจอง',
                  size: 'sm',
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
                label: 'สมัครสมาชิก',
                data: 'action=register',
                displayText: 'สมัครสมาชิก',
              },
            },
            {
              type: 'button',
              style: 'secondary',
              height: 'sm',
              action: {
                type: 'postback',
                label: 'ดูบริการทั้งหมด',
                data: 'action=view_services',
                displayText: 'ดูบริการทั้งหมด',
              },
            },
          ],
        },
      },
    };
  }

  // Main menu message
  createMainMenuMessage(): FlexMessage {
    return {
      type: 'flex',
      altText: 'เมนูหลัก',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: 'เมนูหลัก',
              weight: 'bold',
              size: 'xl',
              margin: 'md',
            },
            {
              type: 'text',
              text: 'เลือกสิ่งที่คุณต้องการทำ',
              size: 'sm',
              color: '#999999',
              margin: 'md',
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
              action: {
                type: 'postback',
                label: 'จองบริการสปา',
                data: 'action=book_service',
                displayText: 'จองบริการสปา',
              },
            },
            {
              type: 'button',
              style: 'secondary',
              action: {
                type: 'postback',
                label: 'ดูบริการ/คอร์ส',
                data: 'action=view_services',
                displayText: 'ดูบริการ/คอร์ส',
              },
            },
            {
              type: 'button',
              style: 'secondary',
              action: {
                type: 'postback',
                label: 'การจองของฉัน',
                data: 'action=my_bookings',
                displayText: 'การจองของฉัน',
              },
            },
            {
              type: 'button',
              style: 'secondary',
              action: {
                type: 'postback',
                label: 'โปรไฟล์',
                data: 'action=my_profile',
                displayText: 'โปรไฟล์',
              },
            },
          ],
        },
      },
    };
  }
}
