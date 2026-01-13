/**
 * Logout API Route
 * POST: Logout user
 */

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { successResponse } from '@/lib/utils/api';
import { getAuthToken, deleteSession } from '@/lib/middleware/auth';

export async function POST(request: NextRequest) {
  const token = getAuthToken(request);
  if (token) {
    deleteSession(token);
  }

  const cookieStore = await cookies();
  cookieStore.delete('auth-token');

  return successResponse({ message: 'Logged out successfully' });
}

