import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LineEventHandlerService } from '../line/services/line-event-handler.service';
import { WebhookEvent } from '@line/bot-sdk';

@Injectable()
export class WebhooksService {
  constructor(
    private prisma: PrismaService,
    private lineEventHandler: LineEventHandlerService,
  ) {}

  // LINE Webhook handlers
  async handleLineWebhook(webhookData: any) {
    const { events } = webhookData;

    if (!events || !Array.isArray(events)) {
      console.log('No events in webhook data');
      return;
    }

    // Process all events
    const results = await Promise.all(
      events.map((event: WebhookEvent) =>
        this.lineEventHandler
          .handleEvent(event)
          .catch((err) => console.error('Error handling event:', err)),
      ),
    );

    console.log(`Processed ${results.length} LINE events`);
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
      .filter((p) => p.status === 'SUCCESS')
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
