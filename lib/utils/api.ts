/**
 * API utility functions
 */

import { NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string[]>
) {
  return NextResponse.json(
    { success: false, error: message, errors },
    { status }
  );
}

/**
 * Handle API errors
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }
  return errorResponse('An unexpected error occurred', 500);
}

