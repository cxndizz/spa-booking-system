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
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('staff')
@UseGuards(JwtAuthGuard)
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: Prisma.StaffCreateInput) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('position') position?: string,
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let where: Prisma.StaffWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } },
        { staffCode: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (position) {
      where.position = position as any;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    return this.staffService.findAll({
      skip,
      take: limitNum,
      where,
      orderBy: { name: 'asc' },
    });
  }

  @Get('active')
  getActiveStaff() {
    return this.staffService.getActiveStaff();
  }

  @Get('available')
  getAvailableStaff(
    @Query('date') date: string,
    @Query('time') time: string,
    @Query('specialties') specialties?: string,
  ) {
    const specialtiesArray = specialties ? specialties.split(',') : [];
    return this.staffService.getAvailableStaff(date, time, specialtiesArray);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: Prisma.StaffUpdateInput) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}