/**
 * Get current user API Route
 * GET: Get authenticated user info
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import User from '@/lib/models/User';
import { successResponse, errorResponse } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }
    const { userId } = authResult;

    await connectDB();

    const user = await User.findById(userId).select('-password').lean();

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(user);
  } catch (error) {
    return errorResponse('An error occurred', 500);
  }
}

