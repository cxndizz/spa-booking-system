import { Injectable } from '@nestjs/common';
import { WebhookEvent, MessageEvent, PostbackEvent, FollowEvent } from '@line/bot-sdk';
import { LineMessageService } from './line-message.service';
import { LineConversationService } from './line-conversation.service';
import { LineRichMenuService } from './line-rich-menu.service';
import { ConversationState } from '../constants/conversation-states';
import {
  createServicesCarousel,
  createBookingConfirmation,
  createBookingsList,
  createUserProfile,
} from '../templates/flex-messages';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';

@Injectable()
export class LineEventHandlerService {
  private registeredRichMenuId: string | null = null;
  private guestRichMenuId: string | null = null;

  constructor(
    private messageService: LineMessageService,
    private conversationService: LineConversationService,
    private richMenuService: LineRichMenuService,
    private configService: ConfigService,
  ) {}

  // Main event handler
  async handleEvent(event: WebhookEvent): Promise<void> {
    console.log(`Handling LINE event: ${event.type}`);

    switch (event.type) {
      case 'message':
        await this.handleMessageEvent(event as MessageEvent);
        break;
      case 'postback':
        await this.handlePostbackEvent(event as PostbackEvent);
        break;
      case 'follow':
        await this.handleFollowEvent(event as FollowEvent);
        break;
      case 'unfollow':
        await this.handleUnfollowEvent(event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  // Handle text and other messages
  private async handleMessageEvent(event: MessageEvent): Promise<void> {
    const userId = event.source.userId;
    if (!userId) return;

    const replyToken = event.replyToken;

    // Check current conversation state
    const currentState = this.conversationService.getState(userId);

    // If user is in a conversation flow, handle based on state
    if (currentState !== ConversationState.IDLE) {
      await this.handleConversationInput(userId, event, replyToken);
      return;
    }

    // Handle message based on type
    if (event.message.type === 'text') {
      await this.handleTextMessage(userId, event.message.text, replyToken);
    } else {
      // Default response for non-text messages
      const message = this.messageService.createTextMessage(
        'ขอโทษค่ะ ระบบรองรับเฉพาะข้อความตัวอักษร\nกรุณาเลือกจากเมนูด้านล่าง หรือพิมพ์คำสั่ง',
      );
      await this.messageService.replyMessage(replyToken, [message]);
    }
  }

  // Handle text message commands
  private async handleTextMessage(
    userId: string,
    text: string,
    replyToken: string,
  ): Promise<void> {
    const lowerText = text.toLowerCase().trim();

    // Check for common commands/keywords
    if (
      lowerText.includes('สมัคร') ||
      lowerText.includes('register') ||
      lowerText === 'สมัครสมาชิก'
    ) {
      await this.startRegistrationFlow(userId, replyToken);
    } else if (
      lowerText.includes('จอง') ||
      lowerText.includes('book') ||
      lowerText === 'จองบริการ'
    ) {
      await this.startBookingFlow(userId, replyToken);
    } else if (
      lowerText.includes('บริการ') ||
      lowerText.includes('service') ||
      lowerText === 'ดูบริการ'
    ) {
      await this.sendServicesCarousel(userId, replyToken);
    } else if (
      lowerText.includes('การจอง') ||
      lowerText.includes('นัดหมาย') ||
      lowerText.includes('my booking')
    ) {
      await this.sendUserBookings(userId, replyToken);
    } else if (
      lowerText.includes('โปรไฟล์') ||
      lowerText.includes('profile') ||
      lowerText === 'ข้อมูลของฉัน'
    ) {
      await this.sendUserProfile(userId, replyToken);
    } else if (
      lowerText.includes('ยกเลิก') ||
      lowerText === 'cancel' ||
      lowerText === 'ยกเลิก'
    ) {
      await this.cancelCurrentFlow(userId, replyToken);
    } else if (lowerText === 'เมนู' || lowerText === 'menu') {
      const message = this.messageService.createMainMenuMessage();
      await this.messageService.replyMessage(replyToken, [message]);
    } else {
      // Send help message
      await this.sendHelpMessage(replyToken);
    }
  }

  // Handle postback events from Rich Menu and buttons
  private async handlePostbackEvent(event: PostbackEvent): Promise<void> {
    const userId = event.source.userId;
    if (!userId) return;

    const replyToken = event.replyToken;
    const data = event.postback.data;

    console.log(`Postback from ${userId}: ${data}`);

    // Parse postback data
    const params = new URLSearchParams(data);
    const action = params.get('action');

    switch (action) {
      case 'register':
        await this.startRegistrationFlow(userId, replyToken);
        break;

      case 'login':
        await this.handleLogin(userId, replyToken);
        break;

      case 'book_service':
        await this.startBookingFlow(userId, replyToken);
        break;

      case 'view_services':
        await this.sendServicesCarousel(userId, replyToken);
        break;

      case 'my_bookings':
        await this.sendUserBookings(userId, replyToken);
        break;

      case 'buy_course':
        await this.startCoursePurchaseFlow(userId, replyToken);
        break;

      case 'my_profile':
        await this.sendUserProfile(userId, replyToken);
        break;

      case 'contact_us':
        await this.sendContactInfo(replyToken);
        break;

      case 'select_service':
        const serviceId = params.get('serviceId');
        if (serviceId) {
          await this.selectServiceForBooking(userId, serviceId, replyToken);
        }
        break;

      case 'select_date':
        const date = params.get('date') || (event.postback.params as { date?: string })?.date;
        if (date) {
          await this.selectDateForBooking(userId, date, replyToken);
        }
        break;

      case 'select_time':
        const time = params.get('time');
        if (time) {
          await this.selectTimeForBooking(userId, time, replyToken);
        }
        break;

      case 'confirm_booking':
        await this.confirmBooking(userId, replyToken);
        break;

      case 'confirm_registration':
        await this.confirmRegistration(userId, replyToken);
        break;

      case 'skip':
        await this.handleSkipAction(userId, replyToken);
        break;

      case 'cancel':
        await this.cancelCurrentFlow(userId, replyToken);
        break;

      case 'back':
        await this.handleBackAction(userId, replyToken);
        break;

      default:
        console.log(`Unknown postback action: ${action}`);
        const message = this.messageService.createTextMessage(
          'ไม่รู้จักคำสั่งนี้',
        );
        await this.messageService.replyMessage(replyToken, [message]);
    }
  }

  // Handle follow event (new user)
  private async handleFollowEvent(event: FollowEvent): Promise<void> {
    const userId = event.source.userId;
    if (!userId) return;

    const replyToken = event.replyToken;

    // Get user profile from LINE
    const profile = await this.messageService.getUserProfile(userId);

    // Create or update user in database
    await this.conversationService.createOrUpdateUser(userId, {
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    });

    // Send welcome message
    const welcomeMessage = this.messageService.createWelcomeMessage(
      profile.displayName,
    );
    await this.messageService.replyMessage(replyToken, [welcomeMessage]);

    // Set guest rich menu for new users
    if (this.guestRichMenuId) {
      await this.richMenuService.linkRichMenuToUser(userId, this.guestRichMenuId);
    }
  }

  // Handle unfollow event
  private async handleUnfollowEvent(event: any): Promise<void> {
    const userId = event.source.userId;
    if (!userId) return;

    // Mark user as inactive
    const user = await this.conversationService.getUser(userId);
    if (user) {
      await this.conversationService.createOrUpdateUser(userId, {});
    }

    // Clear any conversation state
    this.conversationService.clearState(userId);
  }

  // === Registration Flow ===
  private async startRegistrationFlow(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const isRegistered = await this.conversationService.isUserRegistered(userId);

    if (isRegistered) {
      const message = this.messageService.createTextMessage(
        'คุณเป็นสมาชิกอยู่แล้วค่ะ! 🎉\nสามารถจองบริการได้เลย',
        {
          items: [
            this.messageService.createQuickReplyItem(
              'จองบริการ',
              'action=book_service',
            ),
            this.messageService.createQuickReplyItem(
              'ดูโปรไฟล์',
              'action=my_profile',
            ),
          ],
        },
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    // Start registration flow
    this.conversationService.setState(
      userId,
      ConversationState.REGISTRATION_PHONE,
    );

    const message = this.messageService.createTextMessage(
      '📝 สมัครสมาชิก\n\nกรุณาพิมพ์หมายเลขโทรศัพท์ของคุณ\n(ตัวอย่าง: 0812345678)',
      {
        items: [
          this.messageService.createQuickReplyItem(
            'ยกเลิก',
            'action=cancel',
            'ยกเลิกการสมัคร',
          ),
        ],
      },
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async handleLogin(userId: string, replyToken: string): Promise<void> {
    const isRegistered = await this.conversationService.isUserRegistered(userId);

    if (isRegistered) {
      const user = await this.conversationService.getUser(userId);
      const message = this.messageService.createTextMessage(
        `ยินดีต้อนรับกลับมา ${user?.displayName}! 🙏\n\nคุณเข้าสู่ระบบเรียบร้อยแล้ว\nสามารถใช้งานได้ทันที`,
        {
          items: [
            this.messageService.createQuickReplyItem(
              'จองบริการ',
              'action=book_service',
            ),
            this.messageService.createQuickReplyItem(
              'การจองของฉัน',
              'action=my_bookings',
            ),
          ],
        },
      );
      await this.messageService.replyMessage(replyToken, [message]);

      // Switch to registered user rich menu
      if (this.registeredRichMenuId) {
        await this.richMenuService.linkRichMenuToUser(
          userId,
          this.registeredRichMenuId,
        );
      }
    } else {
      const message = this.messageService.createTextMessage(
        'คุณยังไม่ได้เป็นสมาชิก\nกรุณาสมัครสมาชิกก่อนค่ะ',
        {
          items: [
            this.messageService.createQuickReplyItem(
              'สมัครสมาชิก',
              'action=register',
            ),
          ],
        },
      );
      await this.messageService.replyMessage(replyToken, [message]);
    }
  }

  // === Booking Flow ===
  private async startBookingFlow(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const isRegistered = await this.conversationService.isUserRegistered(userId);

    if (!isRegistered) {
      const message = this.messageService.createTextMessage(
        'กรุณาสมัครสมาชิกก่อนจองบริการค่ะ',
        {
          items: [
            this.messageService.createQuickReplyItem(
              'สมัครสมาชิก',
              'action=register',
            ),
          ],
        },
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    // Get available services
    await this.sendServicesCarousel(userId, replyToken);

    // Set state to waiting for service selection
    this.conversationService.setState(
      userId,
      ConversationState.BOOKING_SELECT_SERVICE,
    );
  }

  private async selectServiceForBooking(
    userId: string,
    serviceId: string,
    replyToken: string,
  ): Promise<void> {
    const service = await this.conversationService.getService(serviceId);
    if (!service) {
      const message = this.messageService.createTextMessage(
        'ไม่พบบริการนี้ กรุณาเลือกใหม่',
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    // Save selected service
    this.conversationService.setState(
      userId,
      ConversationState.BOOKING_SELECT_DATE,
      { serviceId, serviceName: service.name, price: Number(service.price) },
    );

    // Ask for date selection with date picker
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    const maxDate = moment().add(30, 'days').format('YYYY-MM-DD');

    const message = this.messageService.createTextMessage(
      `เลือก "${service.name}" แล้ว ✅\nราคา: ฿${service.price}\nระยะเวลา: ${service.durationMinutes} นาที\n\nกรุณาเลือกวันที่ต้องการจอง`,
      {
        items: [
          this.messageService.createDatePickerQuickReply(
            'เลือกวันที่',
            'action=select_date',
            'date',
            tomorrow,
            tomorrow,
            maxDate,
          ),
          this.messageService.createQuickReplyItem(
            'ยกเลิก',
            'action=cancel',
            'ยกเลิกการจอง',
          ),
        ],
      },
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async selectDateForBooking(
    userId: string,
    date: string,
    replyToken: string,
  ): Promise<void> {
    this.conversationService.updateData(userId, { appointmentDate: date });
    this.conversationService.setState(
      userId,
      ConversationState.BOOKING_SELECT_TIME,
    );

    const formattedDate = moment(date).format('DD/MM/YYYY');

    // Offer available time slots
    const message = this.messageService.createTextMessage(
      `วันที่: ${formattedDate} ✅\n\nกรุณาเลือกเวลาที่ต้องการ`,
      {
        items: [
          this.messageService.createQuickReplyItem(
            '09:00',
            'action=select_time&time=09:00',
          ),
          this.messageService.createQuickReplyItem(
            '10:30',
            'action=select_time&time=10:30',
          ),
          this.messageService.createQuickReplyItem(
            '13:00',
            'action=select_time&time=13:00',
          ),
          this.messageService.createQuickReplyItem(
            '14:30',
            'action=select_time&time=14:30',
          ),
          this.messageService.createQuickReplyItem(
            '16:00',
            'action=select_time&time=16:00',
          ),
          this.messageService.createQuickReplyItem(
            'ยกเลิก',
            'action=cancel',
            'ยกเลิกการจอง',
          ),
        ],
      },
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async selectTimeForBooking(
    userId: string,
    time: string,
    replyToken: string,
  ): Promise<void> {
    this.conversationService.updateData(userId, { appointmentTime: time });
    this.conversationService.setState(userId, ConversationState.BOOKING_CONFIRM);

    const data = this.conversationService.getData(userId);
    const formattedDate = moment(data.appointmentDate).format('DD/MM/YYYY');

    const message = this.messageService.createTextMessage(
      `📋 สรุปการจอง\n\nบริการ: ${data.serviceName}\nวันที่: ${formattedDate}\nเวลา: ${time}\nราคา: ฿${data.price}\n\nยืนยันการจองหรือไม่?`,
      {
        items: [
          this.messageService.createQuickReplyItem(
            '✅ ยืนยัน',
            'action=confirm_booking',
            'ยืนยันการจอง',
          ),
          this.messageService.createQuickReplyItem(
            '❌ ยกเลิก',
            'action=cancel',
            'ยกเลิกการจอง',
          ),
        ],
      },
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async confirmBooking(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const data = this.conversationService.getData(userId);
    const user = await this.conversationService.getUser(userId);

    if (!user) {
      const message = this.messageService.createTextMessage(
        'เกิดข้อผิดพลาด กรุณาลองใหม่',
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    const service = await this.conversationService.getService(data.serviceId);
    if (!service) {
      const message = this.messageService.createTextMessage(
        'ไม่พบบริการที่เลือก กรุณาลองใหม่',
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    // Create booking
    const booking = await this.conversationService.createBooking({
      userId: user.id,
      serviceId: data.serviceId,
      serviceName: service.name,
      servicePrice: Number(service.price),
      appointmentDate: new Date(data.appointmentDate),
      appointmentTime: data.appointmentTime,
      durationMinutes: service.durationMinutes,
      totalAmount: data.price,
    });

    // Clear conversation state
    this.conversationService.clearState(userId);

    // Send confirmation
    const confirmationMessage = createBookingConfirmation({
      bookingNumber: booking.bookingNumber,
      serviceName: booking.serviceName,
      appointmentDate: moment(booking.appointmentDate).format('DD/MM/YYYY'),
      appointmentTime: booking.appointmentTime,
      durationMinutes: booking.durationMinutes,
      totalAmount: Number(booking.totalAmount),
      status: booking.status,
    });

    await this.messageService.replyMessage(replyToken, [confirmationMessage]);
  }

  // === Course Purchase Flow ===
  private async startCoursePurchaseFlow(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const message = this.messageService.createTextMessage(
      '🎓 คอร์สสปาพิเศษ\n\nขออภัยค่ะ ฟีเจอร์การซื้อคอร์สกำลังอยู่ในระหว่างการพัฒนา\nโปรดติดตามข่าวสารต่อไปค่ะ',
      {
        items: [
          this.messageService.createQuickReplyItem(
            'ดูบริการ',
            'action=view_services',
          ),
          this.messageService.createQuickReplyItem(
            'ติดต่อเรา',
            'action=contact_us',
          ),
        ],
      },
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  // === Helper Methods ===
  private async handleConversationInput(
    userId: string,
    event: MessageEvent,
    replyToken: string,
  ): Promise<void> {
    const state = this.conversationService.getState(userId);

    if (event.message.type !== 'text') {
      const message = this.messageService.createTextMessage(
        'กรุณาพิมพ์ข้อความตอบกลับ',
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    const text = event.message.text.trim();

    switch (state) {
      case ConversationState.REGISTRATION_PHONE:
        await this.handlePhoneInput(userId, text, replyToken);
        break;

      case ConversationState.REGISTRATION_EMAIL:
        await this.handleEmailInput(userId, text, replyToken);
        break;

      default:
        // Unknown state, reset
        this.conversationService.clearState(userId);
        const message = this.messageService.createTextMessage(
          'เกิดข้อผิดพลาด กรุณาลองใหม่',
        );
        await this.messageService.replyMessage(replyToken, [message]);
    }
  }

  private async handlePhoneInput(
    userId: string,
    phone: string,
    replyToken: string,
  ): Promise<void> {
    // Validate phone number (Thai format)
    const phoneRegex = /^0[0-9]{8,9}$/;
    if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
      const message = this.messageService.createTextMessage(
        'หมายเลขโทรศัพท์ไม่ถูกต้อง\nกรุณาพิมพ์ใหม่ (ตัวอย่าง: 0812345678)',
        {
          items: [
            this.messageService.createQuickReplyItem(
              'ยกเลิก',
              'action=cancel',
            ),
          ],
        },
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    // Save phone and ask for email
    this.conversationService.updateData(userId, {
      phone: phone.replace(/[-\s]/g, ''),
    });
    this.conversationService.setState(
      userId,
      ConversationState.REGISTRATION_EMAIL,
    );

    const message = this.messageService.createTextMessage(
      `เบอร์โทร: ${phone} ✅\n\nกรุณาพิมพ์อีเมลของคุณ\nหรือกด "ข้าม" หากไม่ต้องการระบุ`,
      {
        items: [
          this.messageService.createQuickReplyItem(
            'ข้าม',
            'action=skip',
            'ข้ามอีเมล',
          ),
          this.messageService.createQuickReplyItem(
            'ยกเลิก',
            'action=cancel',
          ),
        ],
      },
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async handleEmailInput(
    userId: string,
    email: string,
    replyToken: string,
  ): Promise<void> {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const message = this.messageService.createTextMessage(
        'อีเมลไม่ถูกต้อง\nกรุณาพิมพ์ใหม่ หรือกด "ข้าม"',
        {
          items: [
            this.messageService.createQuickReplyItem(
              'ข้าม',
              'action=skip',
              'ข้ามอีเมล',
            ),
            this.messageService.createQuickReplyItem(
              'ยกเลิก',
              'action=cancel',
            ),
          ],
        },
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    // Save email and confirm registration
    this.conversationService.updateData(userId, { email });
    await this.confirmRegistration(userId, replyToken);
  }

  private async confirmRegistration(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const data = this.conversationService.getData(userId);

    // Register user
    await this.conversationService.registerUser(userId, data.phone, data.email);

    // Clear state
    this.conversationService.clearState(userId);

    const message = this.messageService.createTextMessage(
      '🎉 สมัครสมาชิกสำเร็จ!\n\nขอบคุณที่สมัครสมาชิกกับเรา\nตอนนี้คุณสามารถจองบริการสปาได้แล้ว',
      {
        items: [
          this.messageService.createQuickReplyItem(
            'จองบริการ',
            'action=book_service',
          ),
          this.messageService.createQuickReplyItem(
            'ดูบริการ',
            'action=view_services',
          ),
        ],
      },
    );
    await this.messageService.replyMessage(replyToken, [message]);

    // Switch to registered user rich menu
    if (this.registeredRichMenuId) {
      await this.richMenuService.linkRichMenuToUser(
        userId,
        this.registeredRichMenuId,
      );
    }
  }

  private async handleSkipAction(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const state = this.conversationService.getState(userId);

    if (state === ConversationState.REGISTRATION_EMAIL) {
      // Skip email, proceed with registration
      await this.confirmRegistration(userId, replyToken);
    } else {
      const message = this.messageService.createTextMessage(
        'ไม่สามารถข้ามขั้นตอนนี้ได้',
      );
      await this.messageService.replyMessage(replyToken, [message]);
    }
  }

  private async cancelCurrentFlow(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    this.conversationService.clearState(userId);

    const message = this.messageService.createTextMessage(
      'ยกเลิกเรียบร้อยแล้ว ✅\n\nหากต้องการเริ่มใหม่ กรุณาเลือกจากเมนู',
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async handleBackAction(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    // Simple back - just cancel for now
    await this.cancelCurrentFlow(userId, replyToken);
  }

  private async sendServicesCarousel(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const services = await this.conversationService.getServices();

    if (services.length === 0) {
      const message = this.messageService.createTextMessage(
        'ขออภัยค่ะ ยังไม่มีบริการในระบบ',
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    const carousel = createServicesCarousel(services);
    await this.messageService.replyMessage(replyToken, [carousel]);
  }

  private async sendUserBookings(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const bookings = await this.conversationService.getUserBookings(userId);
    const message = createBookingsList(bookings);
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async sendUserProfile(
    userId: string,
    replyToken: string,
  ): Promise<void> {
    const user = await this.conversationService.getUser(userId);

    if (!user) {
      const message = this.messageService.createTextMessage(
        'ไม่พบข้อมูลผู้ใช้ กรุณาสมัครสมาชิก',
        {
          items: [
            this.messageService.createQuickReplyItem(
              'สมัครสมาชิก',
              'action=register',
            ),
          ],
        },
      );
      await this.messageService.replyMessage(replyToken, [message]);
      return;
    }

    const profileMessage = createUserProfile({
      displayName: user.displayName,
      phone: user.phone || undefined,
      email: user.email || undefined,
      membershipLevel: user.membershipLevel,
      totalSpent: Number(user.totalSpent),
      pointsBalance: user.pointsBalance,
    });

    await this.messageService.replyMessage(replyToken, [profileMessage]);
  }

  private async sendContactInfo(replyToken: string): Promise<void> {
    const message = this.messageService.createTextMessage(
      '📞 ติดต่อเรา\n\nโทรศัพท์: 02-XXX-XXXX\nEmail: contact@yourspa.com\nLine: @yourspa\n\nเวลาทำการ:\nจันทร์ - เสาร์: 10:00 - 20:00\nอาทิตย์: 10:00 - 18:00',
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  private async sendHelpMessage(replyToken: string): Promise<void> {
    const message = this.messageService.createTextMessage(
      '🔰 คำสั่งที่ใช้ได้:\n\n• "สมัคร" - สมัครสมาชิก\n• "จอง" - จองบริการ\n• "บริการ" - ดูรายการบริการ\n• "การจอง" - ดูการจองของฉัน\n• "โปรไฟล์" - ดูข้อมูลส่วนตัว\n• "เมนู" - แสดงเมนูหลัก\n• "ยกเลิก" - ยกเลิกขั้นตอนปัจจุบัน\n\nหรือเลือกจากเมนูด้านล่าง',
    );
    await this.messageService.replyMessage(replyToken, [message]);
  }

  // Rich Menu management
  setRichMenuIds(registeredMenuId: string, guestMenuId: string): void {
    this.registeredRichMenuId = registeredMenuId;
    this.guestRichMenuId = guestMenuId;
  }
}
