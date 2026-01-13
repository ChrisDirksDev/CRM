/**
 * Projects API Route
 * GET: List all projects
 * POST: Create a new project
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Project from '@/lib/models/Project';
import { createProjectSchema } from '@/lib/schemas/project';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';
import { generateSlug } from '@/lib/utils/slug';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (published !== null) {
      query.published = published === 'true';
    }
    if (featured !== null) {
      query.featured = featured === 'true';
    }

    const [projects, total] = await Promise.all([
      Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(query),
    ]);

    return successResponse({
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authResult = requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const body = await request.json();

    // Generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = generateSlug(body.title);
    }

    // Validate input
    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.flatten().fieldErrors);
    }

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug: validation.data.slug });
    if (existingProject) {
      return errorResponse('A project with this slug already exists', 409);
    }

    const project = await Project.create(validation.data);

    return successResponse(project, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

