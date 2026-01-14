/**
 * Public Post API Route (Read-only)
 * GET: Get published post by slug
 */

import { NextRequest } from 'next/server';
import Post from '@/lib/models/Post';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await Post.findBySlug(params.slug, true);

    if (!post || !post.published) {
      return errorResponse('Post not found', 404);
    }

    // Increment views (fire and forget)
    Post.incrementViews(post.id).catch(() => {});

    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

