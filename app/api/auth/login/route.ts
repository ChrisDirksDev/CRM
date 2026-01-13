/**
 * Authentication API Route
 * POST: Login user
 */

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import { loginSchema } from '@/lib/schemas/auth';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { createSession } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.flatten().fieldErrors);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return errorResponse('Invalid email or password', 401);
    }

    // Create session
    const token = createSession(user._id.toString());

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return successResponse({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

