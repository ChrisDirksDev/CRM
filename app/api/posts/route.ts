/**
 * Posts API Route
 * GET: List all posts
 * POST: Create a new post
 */

import { NextRequest } from 'next/server';
import connectDB from '@/lib/db/connect';
import Post from '@/lib/models/Post';
import { createPostSchema } from '@/lib/schemas/post';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';
import { generateSlug } from '@/lib/utils/slug';
import { parseFrontmatter, validateFrontmatter } from '@/lib/utils/frontmatter';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    const tag = searchParams.get('tag');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: any = {};
    if (published !== null) {
      query.published = published === 'true';
    }
    if (tag) {
      query.tags = tag;
    }

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate('author', 'name email')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(query),
    ]);

    return successResponse({
      posts,
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
    const { userId } = authResult;

    await connectDB();

    const body = await request.json();

    // Parse frontmatter from content
    const { frontmatter, content: markdownContent } = parseFrontmatter(body.content || '');

    // Generate slug if not provided
    if (!body.slug) {
      if (frontmatter.title) {
        body.slug = generateSlug(frontmatter.title);
      } else if (body.title) {
        body.slug = generateSlug(body.title);
      }
    }

    // Merge frontmatter data with body
    const postData = {
      ...body,
      title: body.title || frontmatter.title,
      slug: body.slug,
      content: body.content, // Keep full content with frontmatter
      excerpt: body.excerpt || frontmatter.description,
      tags: body.tags || frontmatter.tags || [],
      published: body.published ?? frontmatter.published ?? false,
      publishedAt: body.publishedAt || (frontmatter.date ? new Date(frontmatter.date) : undefined),
      seoTitle: body.seoTitle || frontmatter.seoTitle,
      seoDescription: body.seoDescription || frontmatter.seoDescription,
      author: userId,
    };

    // Validate input
    const validation = createPostSchema.safeParse(postData);
    if (!validation.success) {
      return errorResponse('Validation failed', 400, validation.error.flatten().fieldErrors);
    }

    // Validate frontmatter
    const frontmatterValidation = validateFrontmatter(frontmatter);
    if (!frontmatterValidation.valid) {
      return errorResponse('Frontmatter validation failed', 400, {
        frontmatter: frontmatterValidation.errors,
      });
    }

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug: validation.data.slug });
    if (existingPost) {
      return errorResponse('A post with this slug already exists', 409);
    }

    const post = await Post.create(validation.data);

    return successResponse(post, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

