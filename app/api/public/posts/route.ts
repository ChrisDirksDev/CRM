/**
 * Public Posts API Route (Read-only)
 * GET: Get all published posts
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Post from '@/lib/models/Post';
import { successResponse, handleApiError } from '@/lib/utils/api';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = { published: true };
    if (tag) {
      query.tags = tag;
    }

    const posts = await Post.find(query)
      .select('-__v')
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return successResponse(posts);
  } catch (error) {
    return handleApiError(error);
  }
}

