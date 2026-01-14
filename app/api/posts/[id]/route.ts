/**
 * Post API Route (Single)
 * GET: Get post by ID
 * PUT: Update post
 * DELETE: Delete post
 */

import { NextRequest } from 'next/server';
import Post from '@/lib/models/Post';
import { updatePostSchema } from '@/lib/schemas/post';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';
import { generateSlug } from '@/lib/utils/slug';
import { parseFrontmatter, validateFrontmatter } from '@/lib/utils/frontmatter';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await Post.findById(params.id, true);

    if (!post) {
      return errorResponse('Post not found', 404);
    }

    return successResponse(post);
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

    const post = await Post.findById(params.id);
    if (!post) {
      return errorResponse('Post not found', 404);
    }

    const body = await request.json();

    // Parse frontmatter if content is provided
    let postData: any = { ...body };
    if (body.content) {
      const { frontmatter, content: markdownContent } = parseFrontmatter(body.content);
      
      // Merge frontmatter data
      postData = {
        ...postData,
        title: postData.title || frontmatter.title,
        excerpt: postData.excerpt || frontmatter.description,
        tags: postData.tags || frontmatter.tags || post.tags,
        published: postData.published ?? frontmatter.published ?? post.published,
        published_at: postData.publishedAt || postData.published_at || (frontmatter.date ? new Date(frontmatter.date).toISOString() : post.published_at),
        seo_title: postData.seoTitle || frontmatter.seoTitle,
        seo_description: postData.seoDescription || frontmatter.seoDescription,
      };

      // Validate frontmatter
      const frontmatterValidation = validateFrontmatter(frontmatter);
      if (!frontmatterValidation.valid) {
        return errorResponse('Frontmatter validation failed', 400, {
          frontmatter: frontmatterValidation.errors,
        });
      }
    }

    // Generate slug if title changed and slug not provided
    if (postData.title && !postData.slug && postData.title !== post.title) {
      postData.slug = generateSlug(postData.title);
    }

    // Validate input
    const validation = updatePostSchema.safeParse(postData);
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.flatten().fieldErrors);
    }

    // Check slug uniqueness if slug is being updated
    if (validation.data.slug && validation.data.slug !== post.slug) {
      const existingPost = await Post.findBySlug(validation.data.slug);
      if (existingPost) {
        return errorResponse('A post with this slug already exists', 409);
      }
    }

    // Convert to Supabase format
    const updateData: any = {};
    if (validation.data.title !== undefined) updateData.title = validation.data.title;
    if (validation.data.slug !== undefined) updateData.slug = validation.data.slug;
    if (validation.data.content !== undefined) updateData.content = validation.data.content;
    if (validation.data.excerpt !== undefined) updateData.excerpt = validation.data.excerpt;
    if (validation.data.tags !== undefined) updateData.tags = validation.data.tags;
    if (validation.data.published !== undefined) updateData.published = validation.data.published;
    if (postData.published_at !== undefined) updateData.published_at = postData.published_at;
    if (postData.seo_title !== undefined) updateData.seo_title = postData.seo_title;
    if (postData.seo_description !== undefined) updateData.seo_description = postData.seo_description;

    const updatedPost = await Post.update(params.id, updateData);

    return successResponse(updatedPost);
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

    const post = await Post.findById(params.id);
    if (!post) {
      return errorResponse('Post not found', 404);
    }

    await Post.delete(params.id);

    return successResponse({ message: 'Post deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

