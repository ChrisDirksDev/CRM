/**
 * Stats API Route
 * GET: Get dashboard statistics
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Project from '@/lib/models/Project';
import Post from '@/lib/models/Post';
import Media from '@/lib/models/Media';
import { successResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authResult = requireAuth(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    await connectDB();

    const [totalProjects, totalPosts, totalMedia, recentProjects, recentPosts] = await Promise.all([
      Project.countDocuments(),
      Post.countDocuments(),
      Media.countDocuments(),
      Project.find().sort({ updatedAt: -1 }).limit(5).lean(),
      Post.find().sort({ updatedAt: -1 }).limit(5).populate('author', 'name').lean(),
    ]);

    return successResponse({
      totalProjects,
      totalPosts,
      totalMedia,
      recentProjects,
      recentPosts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

