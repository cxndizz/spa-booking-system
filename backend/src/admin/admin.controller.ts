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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: Prisma.AdminUserCreateInput) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let where: Prisma.AdminUserWhereInput = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role as any;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    return this.adminService.findAll({
      skip,
      take: limitNum,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('dashboard-stats')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('business-settings')
  getBusinessSettings() {
    return this.adminService.getBusinessSettings();
  }

  @Post('business-settings')
  updateBusinessSetting(
    @Body() body: { key: string; value: any },
    // TODO: Get current user from JWT
  ) {
    return this.adminService.updateBusinessSetting(
      body.key,
      body.value,
      'current-admin-id', // TODO: Replace with actual admin ID from JWT
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: Prisma.AdminUserUpdateInput) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Patch(':id/password')
  updatePassword(@Param('id') id: string, @Body() body: { newPassword: string }) {
    return this.adminService.updatePassword(id, body.newPassword);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}