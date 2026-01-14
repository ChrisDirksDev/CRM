/**
 * Projects API Route
 * GET: List all projects
 * POST: Create a new project
 */

import { NextRequest } from 'next/server';
import Project from '@/lib/models/Project';
import { createProjectSchema } from '@/lib/schemas/project';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';
import { generateSlug } from '@/lib/utils/slug';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: { published?: boolean; featured?: boolean } = {};
    if (published !== null) {
      query.published = published === 'true';
    }
    if (featured !== null) {
      query.featured = featured === 'true';
    }

    const { projects, total } = await Project.find({
      ...query,
      page,
      limit,
    });

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
    const existingProject = await Project.findBySlug(validation.data.slug);
    if (existingProject) {
      return errorResponse('A project with this slug already exists', 409);
    }

    // Convert to Supabase format
    const projectData = {
      title: validation.data.title,
      slug: validation.data.slug,
      description: validation.data.description,
      content: validation.data.content,
      images: validation.data.images || [],
      technologies: validation.data.technologies || [],
      github_link: validation.data.githubLink,
      demo_link: validation.data.demoLink,
      featured: validation.data.featured ?? false,
      published: validation.data.published ?? false,
      seo_title: validation.data.seoTitle,
      seo_description: validation.data.seoDescription,
    };

    const project = await Project.create(projectData);

    return successResponse(project, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

