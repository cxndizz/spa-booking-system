import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByLineUserId(lineUserId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { lineUserId },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        service: true,
        staff: true,
        payments: true,
      },
    });
  }

  async getUserStats(userId: string) {
    const [totalBookings, completedBookings, totalSpent] = await Promise.all([
      this.prisma.booking.count({ where: { userId } }),
      this.prisma.booking.count({
        where: { userId, status: 'COMPLETED' },
      }),
      this.prisma.payment.aggregate({
        where: {
          booking: { userId },
          status: 'SUCCESS',
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      totalSpent: totalSpent._sum.amount || 0,
    };
  }
}
