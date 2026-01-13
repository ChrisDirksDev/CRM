/**
 * Authentication middleware for API routes
 * Simple session-based auth (can be replaced with NextAuth)
 */

import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/lib/utils/api';

// Simple session storage (in production, use proper session management)
const sessions = new Map<string, { userId: string; expiresAt: number }>();

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Get user from session token
 */
export function getSessionUser(token: string | null): string | null {
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  return session.userId;
}

/**
 * Create a new session
 */
export function createSession(userId: string): string {
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  sessions.set(token, {
    userId,
    expiresAt: Date.now() + SESSION_DURATION,
  });
  return token;
}

/**
 * Delete a session
 */
export function deleteSession(token: string): void {
  sessions.delete(token);
}

/**
 * Get auth token from request
 */
export function getAuthToken(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie
  const cookie = request.cookies.get('auth-token');
  return cookie?.value || null;
}

/**
 * Require authentication middleware
 */
export function requireAuth(request: NextRequest): { userId: string } | NextResponse {
  const token = getAuthToken(request);
  const userId = getSessionUser(token);

  if (!userId) {
    return errorResponse('Unauthorized', 401);
  }

  return { userId };
}

