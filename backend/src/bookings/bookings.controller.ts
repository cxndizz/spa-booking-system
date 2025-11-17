import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma, BookingStatus } from '@prisma/client';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createBookingDto: Prisma.BookingCreateInput) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('userId') userId?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let where: Prisma.BookingWhereInput = {};

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: 'insensitive' } },
        { user: { displayName: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search } } },
        { serviceName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status as BookingStatus;
    }

    if (date) {
      where.appointmentDate = new Date(date);
    }

    if (userId) {
      where.userId = userId;
    }

    return this.bookingsService.findAll({
      skip,
      take: limitNum,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('available-slots')
  getAvailableSlots(
    @Query('date') date: string,
    @Query('serviceId') serviceId: string,
  ) {
    return this.bookingsService.getAvailableSlots(date, serviceId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.bookingsService.getBookingStats(start, end);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateBookingDto: Prisma.BookingUpdateInput) {
    return this.bookingsService.update(id, updateBookingDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: BookingStatus }) {
    return this.bookingsService.updateStatus(id, body.status);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.bookingsService.cancel(id, body.reason);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}