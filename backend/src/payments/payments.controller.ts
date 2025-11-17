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
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma, TransactionStatus } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPaymentDto: Prisma.PaymentCreateInput) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('create-charge')
  @UseGuards(JwtAuthGuard)
  createOmiseCharge(@Body() body: { bookingId: string; amount: number; paymentMethod: string }) {
    return this.paymentsService.createOmiseCharge(body.bookingId, body.amount, body.paymentMethod);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('bookingId') bookingId?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let where: Prisma.PaymentWhereInput = {};

    if (search) {
      where.OR = [
        { omiseChargeId: { contains: search, mode: 'insensitive' } },
        { booking: { bookingNumber: { contains: search, mode: 'insensitive' } } },
        { booking: { user: { displayName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (status) {
      where.status = status as TransactionStatus;
    }

    if (paymentMethod) {
      where.paymentMethod = paymentMethod as any;
    }

    if (bookingId) {
      where.bookingId = bookingId;
    }

    return this.paymentsService.findAll({
      skip,
      take: limitNum,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    
    return this.paymentsService.getPaymentStats(start, end);
  }

  @Get('booking/:bookingId')
  getPaymentsByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentsService.findByBookingId(bookingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePaymentDto: Prisma.PaymentUpdateInput) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param('id') id: string, @Body() body: { status: TransactionStatus }) {
    return this.paymentsService.updateStatus(id, body.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}