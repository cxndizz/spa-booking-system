-- Reset Admin Password Migration
-- This script updates the admin user password to 'admin123'
-- bcrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Update existing admin user password
UPDATE admin_users
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    updated_at = NOW()
WHERE email = 'admin@spa.com';

-- If admin user doesn't exist, create one
INSERT INTO admin_users (
  id,
  username,
  email,
  password_hash,
  full_name,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  'admin',
  'admin@spa.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'System Administrator',
  'ADMIN',
  '["bookings.read","bookings.write","users.read","users.write","services.read","services.write","staff.read","staff.write","payments.read","payments.write","settings.read","settings.write"]'::jsonb,
  true,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users WHERE email = 'admin@spa.com'
);

-- Verify the update
SELECT id, email, username, role, is_active,
       SUBSTRING(password_hash, 1, 30) || '...' as password_hash_preview
FROM admin_users
WHERE email = 'admin@spa.com';
