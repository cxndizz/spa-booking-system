#!/usr/bin/env node
/**
 * Reset Admin Password Script
 * This script generates a bcrypt hash for the admin password
 * and updates it directly in the database
 */

const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config();

async function resetAdminPassword() {
  const password = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  const email = 'admin@spa.com';

  console.log('🔐 Resetting admin password...');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);

  // Generate bcrypt hash
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  console.log(`   Hash generated: ${hashedPassword.substring(0, 20)}...`);

  // Connect to database
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Update admin password
    const result = await client.query(
      `UPDATE admin_users
       SET password_hash = $1, updated_at = NOW()
       WHERE email = $2
       RETURNING id, email, username`,
      [hashedPassword, email]
    );

    if (result.rowCount === 0) {
      console.log('⚠️  Admin user not found. Creating new admin user...');

      const insertResult = await client.query(
        `INSERT INTO admin_users (
          id, username, email, password_hash, full_name, role,
          permissions, is_active, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), 'admin', $1, $2, 'System Administrator', 'ADMIN',
          $3::jsonb, true, NOW(), NOW()
        )
        RETURNING id, email, username`,
        [
          email,
          hashedPassword,
          JSON.stringify([
            'bookings.read', 'bookings.write',
            'users.read', 'users.write',
            'services.read', 'services.write',
            'staff.read', 'staff.write',
            'payments.read', 'payments.write',
            'settings.read', 'settings.write',
          ])
        ]
      );

      console.log('✅ Created admin user:', insertResult.rows[0]);
    } else {
      console.log('✅ Updated admin user:', result.rows[0]);
    }

    console.log('\n🎉 Password reset successful!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetAdminPassword();
