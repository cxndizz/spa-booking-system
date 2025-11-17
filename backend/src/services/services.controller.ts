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
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createServiceDto: Prisma.ServiceCreateInput) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    let where: Prisma.ServiceWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { serviceCode: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category as any;
    }

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    return this.servicesService.findAll({
      skip,
      take: limitNum,
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  @Get('active')
  getActiveServices() {
    return this.servicesService.getActiveServices();
  }

  @Get('category/:category')
  getByCategory(@Param('category') category: string) {
    return this.servicesService.getServicesByCategory(category);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  getStats() {
    return this.servicesService.getServiceStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateServiceDto: Prisma.ServiceUpdateInput) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Patch(':id/sort-order')
  @UseGuards(JwtAuthGuard)
  updateSortOrder(@Param('id') id: string, @Body() body: { sortOrder: number }) {
    return this.servicesService.updateSortOrder(id, body.sortOrder);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard)
  toggleFeatured(@Param('id') id: string) {
    return this.servicesService.toggleFeatured(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
