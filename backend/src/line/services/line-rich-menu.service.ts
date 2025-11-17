import { Injectable } from '@nestjs/common';
import { LineClientService } from './line-client.service';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

// Define Rich Menu type inline since RichMenuRequest is not exported in v8
interface RichMenuArea {
  bounds: { x: number; y: number; width: number; height: number };
  action: {
    type: string;
    label?: string;
    data?: string;
    displayText?: string;
    text?: string;
    uri?: string;
  };
}

interface RichMenuSize {
  width: number;
  height: number;
}

interface RichMenuObject {
  size: RichMenuSize;
  selected: boolean;
  name: string;
  chatBarText: string;
  areas: RichMenuArea[];
}

@Injectable()
export class LineRichMenuService {
  constructor(private lineClient: LineClientService) {}

  // Create Rich Menu for registered users
  async createMainRichMenu(): Promise<string> {
    const richMenu: RichMenuObject = {
      size: {
        width: 2500,
        height: 1686,
      },
      selected: true,
      name: 'Main Menu - Registered Users',
      chatBarText: 'เมนู',
      areas: [
        // Top row - 3 buttons
        {
          bounds: { x: 0, y: 0, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'จองบริการ',
            data: 'action=book_service',
            displayText: 'จองบริการสปา',
          },
        },
        {
          bounds: { x: 833, y: 0, width: 834, height: 843 },
          action: {
            type: 'postback',
            label: 'การจองของฉัน',
            data: 'action=my_bookings',
            displayText: 'ดูการจองของฉัน',
          },
        },
        {
          bounds: { x: 1667, y: 0, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'ซื้อคอร์ส',
            data: 'action=buy_course',
            displayText: 'ซื้อคอร์สสปา',
          },
        },
        // Bottom row - 3 buttons
        {
          bounds: { x: 0, y: 843, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'บริการทั้งหมด',
            data: 'action=view_services',
            displayText: 'ดูบริการทั้งหมด',
          },
        },
        {
          bounds: { x: 833, y: 843, width: 834, height: 843 },
          action: {
            type: 'postback',
            label: 'โปรไฟล์',
            data: 'action=my_profile',
            displayText: 'โปรไฟล์ของฉัน',
          },
        },
        {
          bounds: { x: 1667, y: 843, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'ติดต่อเรา',
            data: 'action=contact_us',
            displayText: 'ติดต่อเรา',
          },
        },
      ],
    };

    try {
      const response = await this.lineClient
        .getClient()
        .createRichMenu(richMenu);
      console.log('Created Rich Menu:', response.richMenuId);
      return response.richMenuId;
    } catch (error) {
      console.error('Error creating Rich Menu:', error);
      throw error;
    }
  }

  // Create Rich Menu for new/unregistered users
  async createGuestRichMenu(): Promise<string> {
    const richMenu: RichMenuObject = {
      size: {
        width: 2500,
        height: 1686,
      },
      selected: true,
      name: 'Guest Menu - Unregistered Users',
      chatBarText: 'เมนู',
      areas: [
        // Top row - 3 buttons
        {
          bounds: { x: 0, y: 0, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'สมัครสมาชิก',
            data: 'action=register',
            displayText: 'สมัครสมาชิก',
          },
        },
        {
          bounds: { x: 833, y: 0, width: 834, height: 843 },
          action: {
            type: 'postback',
            label: 'เข้าสู่ระบบ',
            data: 'action=login',
            displayText: 'เข้าสู่ระบบ',
          },
        },
        {
          bounds: { x: 1667, y: 0, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'ดูบริการ',
            data: 'action=view_services',
            displayText: 'ดูบริการทั้งหมด',
          },
        },
        // Bottom row - 3 buttons
        {
          bounds: { x: 0, y: 843, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'ซื้อคอร์ส',
            data: 'action=buy_course',
            displayText: 'ซื้อคอร์สสปา',
          },
        },
        {
          bounds: { x: 833, y: 843, width: 834, height: 843 },
          action: {
            type: 'postback',
            label: 'โปรโมชั่น',
            data: 'action=promotions',
            displayText: 'ดูโปรโมชั่น',
          },
        },
        {
          bounds: { x: 1667, y: 843, width: 833, height: 843 },
          action: {
            type: 'postback',
            label: 'ติดต่อเรา',
            data: 'action=contact_us',
            displayText: 'ติดต่อเรา',
          },
        },
      ],
    };

    try {
      const response = await this.lineClient
        .getClient()
        .createRichMenu(richMenu);
      console.log('Created Guest Rich Menu:', response.richMenuId);
      return response.richMenuId;
    } catch (error) {
      console.error('Error creating Guest Rich Menu:', error);
      throw error;
    }
  }

  // Upload Rich Menu image
  async uploadRichMenuImage(
    richMenuId: string,
    imagePath: string,
  ): Promise<void> {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      // Convert Buffer to Blob for LINE SDK v8+
      const blob = new Blob([imageBuffer], { type: 'image/png' });
      await this.lineClient.getBlobClient().setRichMenuImage(
        richMenuId,
        blob,
      );
      console.log('Uploaded Rich Menu image for:', richMenuId);
    } catch (error) {
      console.error('Error uploading Rich Menu image:', error);
      throw error;
    }
  }

  // Set Rich Menu as default for all users
  async setDefaultRichMenu(richMenuId: string): Promise<void> {
    try {
      await this.lineClient.getClient().setDefaultRichMenu(richMenuId);
      console.log('Set default Rich Menu:', richMenuId);
    } catch (error) {
      console.error('Error setting default Rich Menu:', error);
      throw error;
    }
  }

  // Link Rich Menu to specific user
  async linkRichMenuToUser(
    userId: string,
    richMenuId: string,
  ): Promise<void> {
    try {
      await this.lineClient.getClient().linkRichMenuIdToUser(userId, richMenuId);
      console.log(`Linked Rich Menu ${richMenuId} to user ${userId}`);
    } catch (error) {
      console.error('Error linking Rich Menu to user:', error);
      throw error;
    }
  }

  // Unlink Rich Menu from user (user will see default menu)
  async unlinkRichMenuFromUser(userId: string): Promise<void> {
    try {
      await this.lineClient.getClient().unlinkRichMenuIdFromUser(userId);
      console.log(`Unlinked Rich Menu from user ${userId}`);
    } catch (error) {
      console.error('Error unlinking Rich Menu from user:', error);
      throw error;
    }
  }

  // Get all Rich Menus
  async getAllRichMenus() {
    try {
      return await this.lineClient.getClient().getRichMenuList();
    } catch (error) {
      console.error('Error getting Rich Menus:', error);
      throw error;
    }
  }

  // Delete Rich Menu
  async deleteRichMenu(richMenuId: string): Promise<void> {
    try {
      await this.lineClient.getClient().deleteRichMenu(richMenuId);
      console.log('Deleted Rich Menu:', richMenuId);
    } catch (error) {
      console.error('Error deleting Rich Menu:', error);
      throw error;
    }
  }
}
