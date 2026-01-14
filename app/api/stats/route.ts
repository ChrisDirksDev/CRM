/**
 * Stats API Route
 * GET: Get dashboard statistics
 */

import { NextRequest } from 'next/server';
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

    const [totalProjects, totalPosts, totalMedia, recentProjectsResult, recentPostsResult] = await Promise.all([
      Project.count(),
      Post.count(),
      Media.find({ limit: 1 }).then(r => r.total),
      Project.find({ limit: 5 }),
      Post.find({ limit: 5, includeAuthor: true }),
    ]);

    return successResponse({
      totalProjects,
      totalPosts,
      totalMedia,
      recentProjects: recentProjectsResult.projects,
      recentPosts: recentPostsResult.posts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

