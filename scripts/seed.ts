/**
 * Seed Script
 * Creates an initial admin user for the CMS
 * Run with: npm run seed
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';
import mongoose from 'mongoose';
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
  console.log('⚠️  No .env.local or .env file found. Using default values.');
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio-cms';

async function seed() {
  try {
    if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/portfolio-cms') {
      console.log('⚠️  Using default MongoDB URI. Set MONGODB_URI in .env.local for production.');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });
    if (existingUser) {
      console.log('ℹ️  Admin user already exists');
      await mongoose.disconnect();
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

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();

