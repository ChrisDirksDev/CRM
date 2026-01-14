/**
 * Seed Script
 * Creates an initial admin user for the CMS
 * Run with: npm run seed
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import User from '../lib/models/User';

// Load environment variables from .env.local (preferred) or .env
const envLocalPath = resolve(process.cwd(), '.env.local');
const envPath = resolve(process.cwd(), '.env');

if (existsSync(envLocalPath)) {
  config({ path: envLocalPath });
  console.log('📝 Loaded environment variables from .env.local');
} else if (existsSync(envPath)) {
  config({ path: envPath });
  console.log('📝 Loaded environment variables from .env');
} else {
  console.log('⚠️  No .env.local or .env file found.');
}

async function seed() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing Supabase configuration!');
      console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
      process.exit(1);
    }

    console.log('✅ Connected to Supabase');

    // Check if admin user already exists
    const existingUser = await User.findByEmail('admin@example.com');
    if (existingUser) {
      console.log('ℹ️  Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create({
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: 'admin',
    });

    console.log('✅ Admin user created successfully');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Password: password123');
    console.log('\n⚠️  Please change the default password after first login!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
