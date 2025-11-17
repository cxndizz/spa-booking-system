import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Service } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ServiceCreateInput): Promise<Service> {
    return this.prisma.service.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ServiceWhereUniqueInput;
    where?: Prisma.ServiceWhereInput;
    orderBy?: Prisma.ServiceOrderByWithRelationInput;
  }): Promise<Service[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.service.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: string): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            bookingNumber: true,
            appointmentDate: true,
            status: true,
            totalAmount: true,
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

  async findByServiceCode(serviceCode: string): Promise<Service | null> {
    return this.prisma.service.findUnique({
      where: { serviceCode },
    });
  }

  async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Service> {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Service> {
    return this.prisma.service.delete({
      where: { id },
    });
  }

  async getActiveServices(): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async getServicesByCategory(category: string): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: {
        category: category as any,
        isActive: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  async getServiceStats() {
    const totalServices = await this.prisma.service.count();
    const activeServices = await this.prisma.service.count({
      where: { isActive: true },
    });
    const categoryStats = await this.prisma.service.groupBy({
      by: ['category'],
      _count: true,
      where: { isActive: true },
    });

    return {
      totalServices,
      activeServices,
      categoryStats,
    };
  }

  async updateSortOrder(serviceId: string, sortOrder: number) {
    return this.prisma.service.update({
      where: { id: serviceId },
      data: { sortOrder },
    });
  }

  async toggleFeatured(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { isFeatured: true },
    });

    if (!service) {
      throw new Error('Service not found');
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data: { isFeatured: !service.isFeatured },
    });
  }
}