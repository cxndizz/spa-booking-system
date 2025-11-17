import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConversationState } from '../constants/conversation-states';

interface ConversationData {
  state: ConversationState;
  data: Record<string, any>;
  updatedAt: Date;
}

@Injectable()
export class LineConversationService {
  // In-memory store for conversation states
  // In production, consider using Redis for distributed state management
  private conversationStore: Map<string, ConversationData> = new Map();

  constructor(private prisma: PrismaService) {}

  // Get current conversation state for user
  getState(userId: string): ConversationState {
    const conversation = this.conversationStore.get(userId);
    if (!conversation) {
      return ConversationState.IDLE;
    }

    // Auto-expire conversations after 30 minutes of inactivity
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (conversation.updatedAt < thirtyMinutesAgo) {
      this.clearState(userId);
      return ConversationState.IDLE;
    }

    return conversation.state;
  }

  // Get conversation data
  getData(userId: string): Record<string, any> {
    const conversation = this.conversationStore.get(userId);
    return conversation?.data || {};
  }

  // Set conversation state and data
  setState(
    userId: string,
    state: ConversationState,
    data?: Record<string, any>,
  ): void {
    const currentData = this.getData(userId);
    this.conversationStore.set(userId, {
      state,
      data: { ...currentData, ...data },
      updatedAt: new Date(),
    });
  }

  // Update conversation data without changing state
  updateData(userId: string, data: Record<string, any>): void {
    const conversation = this.conversationStore.get(userId);
    if (conversation) {
      conversation.data = { ...conversation.data, ...data };
      conversation.updatedAt = new Date();
      this.conversationStore.set(userId, conversation);
    }
  }

  // Clear conversation state
  clearState(userId: string): void {
    this.conversationStore.delete(userId);
  }

  // Check if user is registered in database
  async isUserRegistered(lineUserId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { lineUserId },
    });
    return user !== null && user.phone !== null;
  }

  // Get user from database
  async getUser(lineUserId: string) {
    return this.prisma.user.findUnique({
      where: { lineUserId },
    });
  }

  // Create or update user
  async createOrUpdateUser(
    lineUserId: string,
    data: {
      displayName?: string;
      pictureUrl?: string;
      phone?: string;
      email?: string;
    },
  ) {
    return this.prisma.user.upsert({
      where: { lineUserId },
      update: {
        ...data,
        lastActiveAt: new Date(),
      },
      create: {
        lineUserId,
        displayName: data.displayName || 'LINE User',
        pictureUrl: data.pictureUrl,
        phone: data.phone,
        email: data.email,
        isActive: true,
      },
    });
  }

  // Register user with phone and optional email
  async registerUser(
    lineUserId: string,
    phone: string,
    email?: string,
  ): Promise<any> {
    const user = await this.prisma.user.update({
      where: { lineUserId },
      data: {
        phone,
        email,
        lastActiveAt: new Date(),
      },
    });
    this.clearState(lineUserId);
    return user;
  }

  // Get available services
  async getServices(category?: string) {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }
    return this.prisma.service.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  // Get service by ID
  async getService(serviceId: string) {
    return this.prisma.service.findUnique({
      where: { id: serviceId },
    });
  }

  // Get user bookings
  async getUserBookings(lineUserId: string, limit = 10) {
    const user = await this.getUser(lineUserId);
    if (!user) return [];

    return this.prisma.booking.findMany({
      where: { userId: user.id },
      include: { service: true },
      orderBy: { appointmentDate: 'desc' },
      take: limit,
    });
  }

  // Create booking
  async createBooking(data: {
    userId: string;
    serviceId: string;
    appointmentDate: Date;
    appointmentTime: string;
    durationMinutes: number;
    totalAmount: number;
    customerNotes?: string;
  }) {
    const bookingNumber = await this.generateBookingNumber();
    return this.prisma.booking.create({
      data: {
        ...data,
        bookingNumber,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
      include: { service: true, user: true },
    });
  }

  // Generate unique booking number
  private async generateBookingNumber(): Promise<string> {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const count = await this.prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
        },
      },
    });
    return `BK${dateStr}${String(count + 1).padStart(4, '0')}`;
  }
}
