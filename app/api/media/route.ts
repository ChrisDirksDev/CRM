/**
 * Media API Route
 * GET: List all media files
 * POST: Upload a new media file
 */

import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import Media from '@/lib/models/Media';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mimeType = searchParams.get('mimeType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const { media, total } = await Media.find({
      mime_type: mimeType || undefined,
      page,
      limit,
    });

    return successResponse({
      media,
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

    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string | null;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse('File size exceeds 10MB limit', 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(UPLOAD_DIR, filename);
    const url = `/uploads/${filename}`;

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Save to database
    const media = await Media.create({
      filename,
      original_name: file.name,
      mime_type: file.type,
      size: file.size,
      path: filepath,
      url,
      alt: alt || undefined,
      uploaded_by: userId,
    });

    return successResponse(media, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

