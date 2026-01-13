/**
 * Public Project API Route (Read-only)
 * GET: Get published project by slug
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Project from '@/lib/models/Project';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const project = await Project.findOne({
      slug: params.slug,
      published: true,
    }).select('-__v').lean();

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

