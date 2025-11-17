import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private prisma: PrismaService) {}

  // LINE Webhook handlers
  async handleLineWebhook(webhookData: any) {
    const { events } = webhookData;
    
    for (const event of events) {
      await this.processLineEvent(event);
    }
  }

  private async processLineEvent(event: any) {
    const { type, source, message, replyToken } = event;
    const userId = source.userId;

    console.log(`Processing LINE event: ${type} from user: ${userId}`);

    switch (type) {
      case 'message':
        await this.handleLineMessage(userId, message, replyToken);
        break;
      case 'follow':
        await this.handleLineFollow(userId, replyToken);
        break;
      case 'unfollow':
        await this.handleLineUnfollow(userId);
        break;
      case 'postback':
        await this.handleLinePostback(userId, event.postback, replyToken);
        break;
      default:
        console.log(`Unhandled LINE event type: ${type}`);
    }
  }

  private async handleLineMessage(userId: string, message: any, replyToken: string) {
    // Check if user exists in our database
    let user = await this.prisma.user.findUnique({
      where: { lineUserId: userId },
    });

    if (!user) {
      // New user, create basic record
      user = await this.prisma.user.create({
        data: {
          lineUserId: userId,
          displayName: 'LINE User',
          isActive: true,
        },
      });
    }

    // Process the message
    const messageText = message.text?.toLowerCase();

    if (messageText) {
      if (messageText.includes('จอง') || messageText.includes('booking')) {
        await this.sendBookingOptions(replyToken);
      } else if (messageText.includes('ดูนัด') || messageText.includes('my booking')) {
        await this.sendMyBookings(userId, replyToken);
      } else if (messageText.includes('บริการ') || messageText.includes('service')) {
        await this.sendServiceList(replyToken);
      } else {
        await this.sendDefaultResponse(replyToken);
      }
    }
  }

  private async handleLineFollow(userId: string, replyToken: string) {
    // User followed the account
    let user = await this.prisma.user.findUnique({
      where: { lineUserId: userId },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          lineUserId: userId,
          displayName: 'LINE User',
          isActive: true,
        },
      });
    } else {
      // Reactivate user
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isActive: true },
      });
    }

    await this.sendWelcomeMessage(replyToken);
  }

  private async handleLineUnfollow(userId: string) {
    // User unfollowed the account
    await this.prisma.user.updateMany({
      where: { lineUserId: userId },
      data: { isActive: false },
    });
  }

  private async handleLinePostback(userId: string, postback: any, replyToken: string) {
    const data = postback.data;
    
    // Handle postback actions
    console.log(`Postback data: ${data}`);
    // TODO: Implement postback handling based on data
  }

  // LINE message sending methods (placeholders)
  private async sendBookingOptions(replyToken: string) {
    // TODO: Implement LINE API call to send booking options
    console.log(`Sending booking options to ${replyToken}`);
  }

  private async sendMyBookings(userId: string, replyToken: string) {
    // TODO: Get user bookings and send via LINE API
    console.log(`Sending bookings for user ${userId} to ${replyToken}`);
  }

  private async sendServiceList(replyToken: string) {
    // TODO: Get services and send via LINE API
    console.log(`Sending service list to ${replyToken}`);
  }

  private async sendDefaultResponse(replyToken: string) {
    // TODO: Send default response via LINE API
    console.log(`Sending default response to ${replyToken}`);
  }

  private async sendWelcomeMessage(replyToken: string) {
    // TODO: Send welcome message via LINE API
    console.log(`Sending welcome message to ${replyToken}`);
  }

  // Omise Webhook handlers
  async handleOmiseWebhook(webhookData: any) {
    const { object, key, data } = webhookData;
    
    console.log(`Processing Omise webhook: ${object} - ${key}`);

    if (object === 'event' && key === 'charge.complete') {
      await this.handleChargeComplete(data);
    } else if (object === 'event' && key === 'charge.create') {
      await this.handleChargeCreate(data);
    }
    // Add more Omise event handlers as needed
  }

  private async handleChargeComplete(chargeData: any) {
    const chargeId = chargeData.id;
    
    // Find payment by Omise charge ID
    const payment = await this.prisma.payment.findFirst({
      where: { omiseChargeId: chargeId },
    });

    if (payment) {
      // Update payment status
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: chargeData.paid ? 'SUCCESS' : 'FAILED',
          paidAt: chargeData.paid ? new Date() : null,
          omiseWebhookData: chargeData,
        },
      });

      // Update booking payment status
      if (chargeData.paid) {
        await this.updateBookingPaymentStatus(payment.bookingId);
      }
    }
  }

  private async handleChargeCreate(chargeData: any) {
    // Handle charge creation if needed
    console.log(`Charge created: ${chargeData.id}`);
  }

  private async updateBookingPaymentStatus(bookingId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { bookingId },
    });

    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) return;

    const totalPaid = payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    let paymentStatus = 'PENDING';
    if (totalPaid >= Number(booking.totalAmount)) {
      paymentStatus = 'PAID';
    } else if (totalPaid > 0) {
      paymentStatus = 'PARTIAL';
    }

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        paidAmount: totalPaid,
        paymentStatus: paymentStatus as any,
      },
    });
  }
}