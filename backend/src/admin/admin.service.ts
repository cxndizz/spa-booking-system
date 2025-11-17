import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AdminUser } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AdminUserCreateInput): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    return this.prisma.adminUser.create({
      data: {
        ...data,
        passwordHash: hashedPassword,
      },
    });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.AdminUserWhereUniqueInput;
    where?: Prisma.AdminUserWhereInput;
    orderBy?: Prisma.AdminUserOrderByWithRelationInput;
  }): Promise<AdminUser[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.adminUser.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    }) as any;
  }

  async findOne(id: string): Promise<AdminUser | null> {
    return this.prisma.adminUser.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: false,
      },
    }) as any;
  }

  async update(id: string, data: Prisma.AdminUserUpdateInput): Promise<AdminUser> {
    return this.prisma.adminUser.update({
      where: { id },
      data,
    });
  }

  async updatePassword(id: string, newPassword: string): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.adminUser.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });
  }

  async remove(id: string): Promise<AdminUser> {
    return this.prisma.adminUser.delete({
      where: { id },
    });
  }

  async getDashboardStats() {
    const [
      totalBookings,
      totalRevenue,
      totalUsers,
      activeServices,
    ] = await Promise.all([
      this.prisma.booking.count(),
      this.prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true },
      }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.service.count({ where: { isActive: true } }),
    ]);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      todayBookings,
      todayRevenue,
      pendingBookings,
    ] = await Promise.all([
      this.prisma.booking.count({
        where: {
          createdAt: { gte: todayStart },
        },
      }),
      this.prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: { gte: todayStart },
        },
        _sum: { amount: true },
      }),
      this.prisma.booking.count({
        where: { status: 'PENDING' },
      }),
    ]);

    return {
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalUsers,
      activeServices,
      todayBookings,
      todayRevenue: todayRevenue._sum.amount || 0,
      pendingBookings,
    };
  }

  async getBusinessSettings() {
    const settings = await this.prisma.businessSetting.findMany({
      orderBy: { key: 'asc' },
    });

    return settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
  }

  async updateBusinessSetting(key: string, value: any, updatedBy: string) {
    return this.prisma.businessSetting.upsert({
      where: { key },
      update: {
        value,
        updatedBy,
      },
      create: {
        key,
        value,
        updatedBy,
      },
    });
  }
}
