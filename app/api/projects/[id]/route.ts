/**
 * Project API Route (Single)
 * GET: Get project by ID
 * PUT: Update project
 * DELETE: Delete project
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Project from '@/lib/models/Project';
import { updateProjectSchema } from '@/lib/schemas/project';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';
import { generateSlug } from '@/lib/utils/slug';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const project = await Project.findById(params.id).lean();

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const authResult = requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const project = await Project.findById(params.id);
    if (!project) {
      return errorResponse('Project not found', 404);
    }

    const body = await request.json();

    // Generate slug if title changed and slug not provided
    if (body.title && !body.slug && body.title !== project.title) {
      body.slug = generateSlug(body.title);
    }

    // Validate input
    const validation = updateProjectSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.flatten().fieldErrors);
    }

    // Check slug uniqueness if slug is being updated
    if (validation.data.slug && validation.data.slug !== project.slug) {
      const existingProject = await Project.findOne({ slug: validation.data.slug });
      if (existingProject) {
        return errorResponse('A project with this slug already exists', 409);
      }
    }

    Object.assign(project, validation.data);
    await project.save();

    return successResponse(project);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const authResult = requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const project = await Project.findByIdAndDelete(params.id);

    if (!project) {
      return errorResponse('Project not found', 404);
    }

    return successResponse({ message: 'Project deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

