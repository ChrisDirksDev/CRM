/**
 * Public Posts API Route (Read-only)
 * GET: Get all published posts
 */

import { NextRequest } from 'next/server';
import Post from '@/lib/models/Post';
import { successResponse, handleApiError } from '@/lib/utils/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '10');

    const { posts } = await Post.find({
      published: true,
      tag: tag || undefined,
      limit,
      includeAuthor: true,
    });

    return successResponse(posts);
  } catch (error) {
    return handleApiError(error);
  }
}

