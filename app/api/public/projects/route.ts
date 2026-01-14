/**
 * Public Projects API Route (Read-only)
 * GET: Get all published projects
 */

import { NextRequest } from 'next/server';
import Project from '@/lib/models/Project';
import { successResponse, handleApiError } from '@/lib/utils/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    const { projects } = await Project.find({
      published: true,
      featured: featured === 'true' ? true : undefined,
      limit,
    });

    return successResponse(projects);
  } catch (error) {
    return handleApiError(error);
  }
}

