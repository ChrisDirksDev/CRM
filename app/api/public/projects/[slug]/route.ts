/**
 * Public Project API Route (Read-only)
 * GET: Get published project by slug
 */

import { NextRequest } from 'next/server';
import Project from '@/lib/models/Project';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await Project.findBySlug(params.slug);

    if (!project || !project.published) {
      return errorResponse('Project not found', 404);
    }

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

