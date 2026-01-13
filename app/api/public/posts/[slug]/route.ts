/**
 * Public Post API Route (Read-only)
 * GET: Get published post by slug
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Post from '@/lib/models/Post';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();

    const post = await Post.findOne({
      slug: params.slug,
      published: true,
    })
      .select('-__v')
      .populate('author', 'name')
      .lean();

    if (!post) {
      return errorResponse('Post not found', 404);
    }

    // Increment views (fire and forget)
    Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } }).catch(() => {});

    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

