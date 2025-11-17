import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Payment, TransactionStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PaymentWhereUniqueInput;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.payment.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        booking: {
          select: {
            bookingNumber: true,
            serviceName: true,
            appointmentDate: true,
            user: {
              select: {
                displayName: true,
                phone: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: {
        booking: {
          include: {
            user: true,
            service: true,
          },
        },
      },
    });
  }

  async findByBookingId(bookingId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOmiseChargeId(omiseChargeId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({
      where: { omiseChargeId },
    });
  }

  async update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: TransactionStatus, additionalData?: any) {
    const updateData: Prisma.PaymentUpdateInput = { status };

    if (status === 'SUCCESS') {
      updateData.paidAt = new Date();
    }

    if (additionalData) {
      updateData.omiseWebhookData = additionalData;
    }

    const payment = await this.prisma.payment.update({
      where: { id },
      data: updateData,
    });

    // Update booking payment status if payment is successful
    if (status === 'SUCCESS') {
      await this.updateBookingPaymentStatus(payment.bookingId);
    }

    return payment;
  }

  async remove(id: string): Promise<Payment> {
    return this.prisma.payment.delete({
      where: { id },
    });
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

  async getPaymentStats(startDate?: Date, endDate?: Date) {
    const where: Prisma.PaymentWhereInput = {};
    
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const totalPayments = await this.prisma.payment.count({ where });
    
    const statusStats = await this.prisma.payment.groupBy({
      by: ['status'],
      _count: true,
      where,
    });

    const methodStats = await this.prisma.payment.groupBy({
      by: ['paymentMethod'],
      _count: true,
      _sum: {
        amount: true,
      },
      where: {
        ...where,
        status: 'SUCCESS',
      },
    });

    const revenueStats = await this.prisma.payment.aggregate({
      where: {
        ...where,
        status: 'SUCCESS',
      },
      _sum: {
        amount: true,
      },
      _avg: {
        amount: true,
      },
    });

    return {
      totalPayments,
      statusStats,
      methodStats,
      revenue: {
        total: revenueStats._sum.amount || 0,
        average: revenueStats._avg.amount || 0,
      },
    };
  }

  // Omise integration methods
  async createOmiseCharge(bookingId: string, amount: number, paymentMethod: string) {
    // TODO: Implement Omise API integration
    // This is a placeholder for Omise charge creation
    
    const payment = await this.create({
      booking: { connect: { id: bookingId } },
      amount,
      currency: 'THB',
      paymentMethod: paymentMethod as any,
      status: 'PENDING',
      // omiseChargeId will be set when Omise responds
    });

    return payment;
  }

  async handleOmiseWebhook(webhookData: any) {
    const { data } = webhookData;
    const chargeId = data.id;

    const payment = await this.findByOmiseChargeId(chargeId);
    if (!payment) {
      throw new Error(`Payment not found for charge ID: ${chargeId}`);
    }

    let status: TransactionStatus = 'PENDING';
    
    switch (data.status) {
      case 'successful':
        status = 'SUCCESS';
        break;
      case 'failed':
        status = 'FAILED';
        break;
      case 'pending':
        status = 'PROCESSING';
        break;
      default:
        status = 'PENDING';
    }

    return this.updateStatus(payment.id, status, webhookData);
  }
}