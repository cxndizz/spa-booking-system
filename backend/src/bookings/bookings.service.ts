import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Booking, BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BookingCreateInput): Promise<Booking> {
    // Generate booking number
    const bookingNumber = await this.generateBookingNumber();
    
    const booking = await this.prisma.booking.create({
      data: {
        ...data,
        bookingNumber,
      },
      include: {
        user: {
          select: {
            displayName: true,
            phone: true,
            email: true,
          },
        },
        service: {
          select: {
            name: true,
            category: true,
          },
        },
      },
    });

    // Create booking log
    await this.createBookingLog(booking.id, 'CREATED', null, booking, 'system');

    return booking;
  }

  private async generateBookingNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    
    const lastBooking = await this.prisma.booking.findFirst({
      where: {
        bookingNumber: {
          startsWith: `SPA${dateStr}`,
        },
      },
      orderBy: {
        bookingNumber: 'desc',
      },
    });

    let sequence = 1;
    if (lastBooking) {
      const lastSequence = parseInt(lastBooking.bookingNumber.slice(-3));
      sequence = lastSequence + 1;
    }

    return `SPA${dateStr}${sequence.toString().padStart(3, '0')}`;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BookingWhereUniqueInput;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.booking.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: {
          select: {
            displayName: true,
            phone: true,
            email: true,
          },
        },
        service: {
          select: {
            name: true,
            category: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            paymentMethod: true,
            paidAt: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        service: true,
        payments: true,
        bookingLogs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async update(id: string, data: Prisma.BookingUpdateInput, changedBy: string = 'system') {
    const oldBooking = await this.prisma.booking.findUnique({
      where: { id },
    });

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data,
      include: {
        user: true,
        service: true,
      },
    });

    // Create booking log
    await this.createBookingLog(id, 'UPDATED', oldBooking, updatedBooking, changedBy);

    return updatedBooking;
  }

  async updateStatus(id: string, status: BookingStatus, changedBy: string = 'system') {
    return this.update(id, { status }, changedBy);
  }

  async cancel(id: string, reason: string, changedBy: string = 'system') {
    return this.update(
      id,
      {
        status: 'CANCELLED',
        cancellationReason: reason,
      },
      changedBy,
    );
  }

  async remove(id: string): Promise<Booking> {
    return this.prisma.booking.delete({
      where: { id },
    });
  }

  async getAvailableSlots(date: string, serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new Error('Service not found');
    }

    // Get business hours (you can make this configurable)
    const businessStart = 9; // 9:00 AM
    const businessEnd = 18; // 6:00 PM
    const slotDuration = 30; // 30 minutes

    // Generate all possible slots
    const allSlots = [];
    for (let hour = businessStart; hour < businessEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(time);
      }
    }

    // Get existing bookings for the date
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        appointmentDate: new Date(date),
        status: {
          in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'],
        },
      },
    });

    // Filter out booked slots
    const bookedSlots = existingBookings.map(booking => booking.appointmentTime);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    return availableSlots;
  }

  async getBookingStats(startDate?: Date, endDate?: Date) {
    const where: Prisma.BookingWhereInput = {};
    
    if (startDate && endDate) {
      where.appointmentDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    const totalBookings = await this.prisma.booking.count({ where });
    
    const statusStats = await this.prisma.booking.groupBy({
      by: ['status'],
      _count: true,
      where,
    });

    const revenueStats = await this.prisma.booking.aggregate({
      where: {
        ...where,
        status: 'COMPLETED',
      },
      _sum: {
        totalAmount: true,
      },
      _avg: {
        totalAmount: true,
      },
    });

    return {
      totalBookings,
      statusStats,
      revenue: {
        total: revenueStats._sum.totalAmount || 0,
        average: revenueStats._avg.totalAmount || 0,
      },
    };
  }

  private async createBookingLog(
    bookingId: string,
    action: string,
    oldData: any,
    newData: any,
    changedBy: string,
  ) {
    return this.prisma.bookingLog.create({
      data: {
        bookingId,
        action: action as any,
        oldData: oldData || undefined,
        newData,
        changedBy,
      },
    });
  }
}