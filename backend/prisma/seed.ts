import { PrismaClient, AdminRole, ServiceCategory, StaffPosition } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create Default Admin User
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const defaultAdmin = await prisma.adminUser.upsert({
    where: { email: 'admin@spa.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@spa.com',
      passwordHash: hashedPassword,
      fullName: 'System Administrator',
      role: AdminRole.ADMIN,
      permissions: [
        'bookings.read',
        'bookings.write',
        'users.read',
        'users.write',
        'services.read',
        'services.write',
        'staff.read',
        'staff.write',
        'payments.read',
        'payments.write',
        'settings.read',
        'settings.write',
      ],
      isActive: true,
    },
  });

  console.log('✅ Created admin user:', {
    email: defaultAdmin.email,
    username: defaultAdmin.username,
    role: defaultAdmin.role,
  });

  // 2. Create Sample Services
  const services = [
    {
      serviceCode: 'FACIAL-001',
      name: 'Deep Cleansing Facial',
      description: 'ดูแลผิวหน้าเชิงลึก ทำความสะอาดรูขุมขน',
      category: ServiceCategory.FACIAL,
      price: 1500,
      memberPrice: 1350,
      durationMinutes: 60,
      maxParticipants: 1,
      requiredStaffCount: 1,
      requiredStaffSpecialties: ['FACIAL'],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      serviceCode: 'MASSAGE-001',
      name: 'Thai Traditional Massage',
      description: 'นวดแผนไทยแบบดั้งเดิม ผ่อนคลายกล้ามเนื้อ',
      category: ServiceCategory.MASSAGE,
      price: 800,
      memberPrice: 720,
      durationMinutes: 60,
      maxParticipants: 1,
      requiredStaffCount: 1,
      requiredStaffSpecialties: ['MASSAGE'],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      serviceCode: 'MASSAGE-002',
      name: 'Aromatherapy Massage',
      description: 'นวดน้ำมันหอมระเหย ผ่อนคลายทั้งกายและใจ',
      category: ServiceCategory.MASSAGE,
      price: 1200,
      memberPrice: 1080,
      durationMinutes: 90,
      maxParticipants: 1,
      requiredStaffCount: 1,
      requiredStaffSpecialties: ['MASSAGE'],
      isFeatured: true,
      sortOrder: 3,
    },
    {
      serviceCode: 'BODY-001',
      name: 'Body Scrub Treatment',
      description: 'ขัดผิวกายด้วยสครับธรรมชาติ ผิวนุ่มชุ่มชื้น',
      category: ServiceCategory.BODY_TREATMENT,
      price: 1800,
      memberPrice: 1620,
      durationMinutes: 75,
      maxParticipants: 1,
      requiredStaffCount: 1,
      requiredStaffSpecialties: ['BODY_TREATMENT'],
      isFeatured: false,
      sortOrder: 4,
    },
    {
      serviceCode: 'PKG-001',
      name: 'Relaxation Package',
      description: 'แพ็คเกจผ่อนคลาย: นวดไทย 60 นาที + Facial 60 นาที',
      category: ServiceCategory.PACKAGE,
      price: 2000,
      memberPrice: 1800,
      durationMinutes: 120,
      maxParticipants: 1,
      requiredStaffCount: 2,
      requiredStaffSpecialties: ['MASSAGE', 'FACIAL'],
      isFeatured: true,
      sortOrder: 5,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { serviceCode: service.serviceCode },
      update: {},
      create: service,
    });
  }

  console.log(`✅ Created ${services.length} services`);

  // 3. Create Sample Staff
  const staffMembers = [
    {
      staffCode: 'STAFF-001',
      name: 'คุณแอน',
      nickname: 'แอน',
      phone: '081-111-1111',
      email: 'ann@spa.com',
      position: StaffPosition.THERAPIST,
      specialties: ['FACIAL', 'BODY_TREATMENT'],
      hourlyRate: 200,
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      workStartTime: '09:00',
      workEndTime: '18:00',
    },
    {
      staffCode: 'STAFF-002',
      name: 'คุณบิว',
      nickname: 'บิว',
      phone: '081-222-2222',
      email: 'bew@spa.com',
      position: StaffPosition.THERAPIST,
      specialties: ['MASSAGE'],
      hourlyRate: 180,
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      workStartTime: '10:00',
      workEndTime: '19:00',
    },
    {
      staffCode: 'STAFF-003',
      name: 'คุณน้ำ',
      nickname: 'น้ำ',
      phone: '081-333-3333',
      email: 'nam@spa.com',
      position: StaffPosition.THERAPIST,
      specialties: ['MASSAGE', 'BODY_TREATMENT'],
      hourlyRate: 190,
      workDays: ['tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      workStartTime: '11:00',
      workEndTime: '20:00',
    },
  ];

  for (const staff of staffMembers) {
    await prisma.staff.upsert({
      where: { staffCode: staff.staffCode },
      update: {},
      create: staff,
    });
  }

  console.log(`✅ Created ${staffMembers.length} staff members`);

  // 4. Create Default Business Settings
  const settings = [
    {
      key: 'business_name',
      value: 'Serenity Spa & Wellness',
      description: 'ชื่อธุรกิจ',
    },
    {
      key: 'business_hours',
      value: {
        monday: { open: '09:00', close: '21:00' },
        tuesday: { open: '09:00', close: '21:00' },
        wednesday: { open: '09:00', close: '21:00' },
        thursday: { open: '09:00', close: '21:00' },
        friday: { open: '09:00', close: '21:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '10:00', close: '20:00' },
      },
      description: 'เวลาทำการ',
    },
    {
      key: 'booking_advance_days',
      value: 30,
      description: 'จำนวนวันที่สามารถจองล่วงหน้าได้',
    },
    {
      key: 'cancellation_policy_hours',
      value: 24,
      description: 'ชั่วโมงก่อนนัดที่สามารถยกเลิกได้',
    },
    {
      key: 'points_per_baht',
      value: 1,
      description: 'แต้มที่ได้ต่อ 1 บาท',
    },
    {
      key: 'points_to_baht_rate',
      value: 100,
      description: 'แต้มที่ต้องใช้แลก 1 บาท',
    },
  ];

  for (const setting of settings) {
    await prisma.businessSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log(`✅ Created ${settings.length} business settings`);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📋 Admin Login Credentials:');
  console.log('   Email: admin@spa.com');
  console.log(`   Password: ${adminPassword}`);
  console.log('\n⚠️  Please change the default password after first login!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
