import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Staff } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.StaffCreateInput): Promise<Staff> {
    return this.prisma.staff.create({ data });
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StaffWhereUniqueInput;
    where?: Prisma.StaffWhereInput;
    orderBy?: Prisma.StaffOrderByWithRelationInput;
  }): Promise<Staff[]> {
    const { skip, take, cursor, where, orderBy } = params || {};
    return this.prisma.staff.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: string): Promise<Staff | null> {
    return this.prisma.staff.findUnique({
      where: { id },
    });
  }

  async findByStaffCode(staffCode: string): Promise<Staff | null> {
    return this.prisma.staff.findUnique({
      where: { staffCode },
    });
  }

  async update(id: string, data: Prisma.StaffUpdateInput): Promise<Staff> {
    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<Staff> {
    return this.prisma.staff.delete({
      where: { id },
    });
  }

  async getActiveStaff(): Promise<Staff[]> {
    return this.prisma.staff.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async getAvailableStaff(date: string, time: string, specialties?: string[]) {
    let where: Prisma.StaffWhereInput = {
      isActive: true,
    };

    if (specialties && specialties.length > 0) {
      where.specialties = {
        array_contains: specialties,
      };
    }

    const staff = await this.prisma.staff.findMany({
      where,
    });

    // TODO: Check staff schedule and existing bookings
    return staff;
  }
}