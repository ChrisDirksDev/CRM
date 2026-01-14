/**
 * Project API Route (Single)
 * GET: Get project by ID
 * PUT: Update project
 * DELETE: Delete project
 */

import { NextRequest } from 'next/server';
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
    const project = await Project.findById(params.id);

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
      const existingProject = await Project.findBySlug(validation.data.slug);
      if (existingProject) {
        return errorResponse('A project with this slug already exists', 409);
      }
    }

    // Convert to Supabase format
    const updateData: any = {};
    if (validation.data.title !== undefined) updateData.title = validation.data.title;
    if (validation.data.slug !== undefined) updateData.slug = validation.data.slug;
    if (validation.data.description !== undefined) updateData.description = validation.data.description;
    if (validation.data.content !== undefined) updateData.content = validation.data.content;
    if (validation.data.images !== undefined) updateData.images = validation.data.images;
    if (validation.data.technologies !== undefined) updateData.technologies = validation.data.technologies;
    if (validation.data.githubLink !== undefined) updateData.github_link = validation.data.githubLink;
    if (validation.data.demoLink !== undefined) updateData.demo_link = validation.data.demoLink;
    if (validation.data.featured !== undefined) updateData.featured = validation.data.featured;
    if (validation.data.published !== undefined) updateData.published = validation.data.published;
    if (validation.data.seoTitle !== undefined) updateData.seo_title = validation.data.seoTitle;
    if (validation.data.seoDescription !== undefined) updateData.seo_description = validation.data.seoDescription;

    const updatedProject = await Project.update(params.id, updateData);

    return successResponse(updatedProject);
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

    const project = await Project.findById(params.id);
    if (!project) {
      return errorResponse('Project not found', 404);
    }

    await Project.delete(params.id);

    return successResponse({ message: 'Project deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

