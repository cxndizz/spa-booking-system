/**
 * Rich Menu Setup Script
 *
 * This script creates and configures Rich Menus for the LINE bot.
 * Run with: npx ts-node scripts/setup-rich-menu.ts
 */

import { messagingApi } from '@line/bot-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!channelAccessToken) {
  console.error('ERROR: LINE_CHANNEL_ACCESS_TOKEN is not set in .env file');
  process.exit(1);
}

const client = new messagingApi.MessagingApiClient({
  channelAccessToken,
});

// Rich Menu for registered users (6 buttons)
const registeredUserMenu = {
  size: {
    width: 2500,
    height: 1686,
  },
  selected: true,
  name: 'สมาชิก - Main Menu',
  chatBarText: 'เมนู',
  areas: [
    // Top row
    {
      bounds: { x: 0, y: 0, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'จองบริการ',
        data: 'action=book_service',
        displayText: 'จองบริการสปา',
      },
    },
    {
      bounds: { x: 833, y: 0, width: 834, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'การจองของฉัน',
        data: 'action=my_bookings',
        displayText: 'ดูการจองของฉัน',
      },
    },
    {
      bounds: { x: 1667, y: 0, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'ซื้อคอร์ส',
        data: 'action=buy_course',
        displayText: 'ซื้อคอร์สสปา',
      },
    },
    // Bottom row
    {
      bounds: { x: 0, y: 843, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'ดูบริการ',
        data: 'action=view_services',
        displayText: 'ดูบริการทั้งหมด',
      },
    },
    {
      bounds: { x: 833, y: 843, width: 834, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'โปรไฟล์',
        data: 'action=my_profile',
        displayText: 'โปรไฟล์ของฉัน',
      },
    },
    {
      bounds: { x: 1667, y: 843, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'ติดต่อเรา',
        data: 'action=contact_us',
        displayText: 'ติดต่อเรา',
      },
    },
  ],
};

// Rich Menu for guests/unregistered users
const guestMenu = {
  size: {
    width: 2500,
    height: 1686,
  },
  selected: true,
  name: 'ผู้เยี่ยมชม - Guest Menu',
  chatBarText: 'เมนู',
  areas: [
    // Top row
    {
      bounds: { x: 0, y: 0, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'สมัครสมาชิก',
        data: 'action=register',
        displayText: 'สมัครสมาชิก',
      },
    },
    {
      bounds: { x: 833, y: 0, width: 834, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'เข้าสู่ระบบ',
        data: 'action=login',
        displayText: 'เข้าสู่ระบบ',
      },
    },
    {
      bounds: { x: 1667, y: 0, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'ดูบริการ',
        data: 'action=view_services',
        displayText: 'ดูบริการทั้งหมด',
      },
    },
    // Bottom row
    {
      bounds: { x: 0, y: 843, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'ซื้อคอร์ส',
        data: 'action=buy_course',
        displayText: 'ซื้อคอร์สสปา',
      },
    },
    {
      bounds: { x: 833, y: 843, width: 834, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'โปรโมชั่น',
        data: 'action=promotions',
        displayText: 'ดูโปรโมชั่น',
      },
    },
    {
      bounds: { x: 1667, y: 843, width: 833, height: 843 },
      action: {
        type: 'postback' as const,
        label: 'ติดต่อเรา',
        data: 'action=contact_us',
        displayText: 'ติดต่อเรา',
      },
    },
  ],
};

async function cleanupOldMenus() {
  console.log('Cleaning up old Rich Menus...');
  const menus = await client.getRichMenuList();

  for (const menu of menus.richmenus) {
    console.log(`Deleting menu: ${menu.richMenuId} (${menu.name})`);
    await client.deleteRichMenu(menu.richMenuId);
  }
}

async function createRichMenus() {
  try {
    // Optional: Clean up old menus first
    // await cleanupOldMenus();

    console.log('Creating Rich Menus...\n');

    // Create registered user menu
    console.log('1. Creating Registered User Menu...');
    const registeredMenuResponse = await client.createRichMenu(registeredUserMenu);
    console.log(`   Created: ${registeredMenuResponse.richMenuId}`);

    // Create guest menu
    console.log('2. Creating Guest Menu...');
    const guestMenuResponse = await client.createRichMenu(guestMenu);
    console.log(`   Created: ${guestMenuResponse.richMenuId}`);

    // Set guest menu as default (for new users)
    console.log('\n3. Setting Guest Menu as default...');
    await client.setDefaultRichMenu(guestMenuResponse.richMenuId);
    console.log('   Default menu set successfully');

    console.log('\n========================================');
    console.log('Rich Menu Setup Complete!');
    console.log('========================================');
    console.log('\nMenu IDs:');
    console.log(`  Registered Users: ${registeredMenuResponse.richMenuId}`);
    console.log(`  Guest Users:      ${guestMenuResponse.richMenuId}`);
    console.log('\nIMPORTANT: Save these IDs in your .env file:');
    console.log(`LINE_RICH_MENU_REGISTERED=${registeredMenuResponse.richMenuId}`);
    console.log(`LINE_RICH_MENU_GUEST=${guestMenuResponse.richMenuId}`);
    console.log('\nNext Steps:');
    console.log('1. Upload images for each Rich Menu via LINE Developers Console');
    console.log('   or use the LINE Bot SDK to upload images programmatically.');
    console.log('2. The image should be 2500x1686 pixels in JPEG or PNG format.');
    console.log('3. Design the image to match the 6-button grid layout (2x3).');
    console.log('\nRich Menu Layout:');
    console.log('┌─────────────┬─────────────┬─────────────┐');
    console.log('│  จองบริการ  │ การจองของฉัน │  ซื้อคอร์ส   │');
    console.log('├─────────────┼─────────────┼─────────────┤');
    console.log('│   ดูบริการ   │   โปรไฟล์    │  ติดต่อเรา   │');
    console.log('└─────────────┴─────────────┴─────────────┘');

  } catch (error) {
    console.error('Error creating Rich Menus:', error);
    process.exit(1);
  }
}

// List all existing Rich Menus
async function listRichMenus() {
  try {
    const menus = await client.getRichMenuList();
    console.log('Existing Rich Menus:');
    menus.richmenus.forEach((menu, index) => {
      console.log(`${index + 1}. ${menu.name} (${menu.richMenuId})`);
    });
  } catch (error) {
    console.error('Error listing Rich Menus:', error);
  }
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'create':
    createRichMenus();
    break;
  case 'list':
    listRichMenus();
    break;
  case 'cleanup':
    cleanupOldMenus().then(() => console.log('Cleanup complete'));
    break;
  default:
    console.log('Rich Menu Management Tool');
    console.log('Usage: npx ts-node scripts/setup-rich-menu.ts <command>');
    console.log('\nCommands:');
    console.log('  create  - Create new Rich Menus');
    console.log('  list    - List existing Rich Menus');
    console.log('  cleanup - Delete all existing Rich Menus');
}
