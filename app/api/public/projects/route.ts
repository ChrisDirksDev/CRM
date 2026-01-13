/**
 * Public Projects API Route (Read-only)
 * GET: Get all published projects
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Project from '@/lib/models/Project';
import { successResponse, handleApiError } from '@/lib/utils/api';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = { published: true };
    if (featured === 'true') {
      query.featured = true;
    }

    const projects = await Project.find(query)
      .select('-__v')
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(projects);
  } catch (error) {
    return handleApiError(error);
  }
}

