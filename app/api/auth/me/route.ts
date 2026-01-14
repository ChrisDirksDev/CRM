/**
 * Get current user API Route
 * GET: Get authenticated user info
 */

import { NextRequest } from 'next/server';
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

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return successResponse(userWithoutPassword);
  } catch (error) {
    return errorResponse('An error occurred', 500);
  }
}

