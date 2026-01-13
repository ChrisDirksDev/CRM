/**
 * Post API Route (Single)
 * GET: Get post by ID
 * PUT: Update post
 * DELETE: Delete post
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
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
    await connectDB();

    const post = await Post.findById(params.id).populate('author', 'name email').lean();

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

    await connectDB();

    const post = await Post.findById(params.id);
    if (!post) {
      return errorResponse('Post not found', 404);
    }

    const body = await request.json();

    // Parse frontmatter if content is provided
    let postData = { ...body };
    if (body.content) {
      const { frontmatter, content: markdownContent } = parseFrontmatter(body.content);
      
      // Merge frontmatter data
      postData = {
        ...postData,
        title: postData.title || frontmatter.title,
        excerpt: postData.excerpt || frontmatter.description,
        tags: postData.tags || frontmatter.tags || post.tags,
        published: postData.published ?? frontmatter.published ?? post.published,
        publishedAt: postData.publishedAt || (frontmatter.date ? new Date(frontmatter.date) : post.publishedAt),
        seoTitle: postData.seoTitle || frontmatter.seoTitle,
        seoDescription: postData.seoDescription || frontmatter.seoDescription,
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
      const existingPost = await Post.findOne({ slug: validation.data.slug });
      if (existingPost) {
        return errorResponse('A post with this slug already exists', 409);
      }
    }

    Object.assign(post, validation.data);
    await post.save();

    return successResponse(post);
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

    const post = await Post.findByIdAndDelete(params.id);

    if (!post) {
      return errorResponse('Post not found', 404);
    }

    return successResponse({ message: 'Post deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

