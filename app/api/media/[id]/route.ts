/**
 * Media API Route (Single)
 * GET: Get media by ID
 * DELETE: Delete media file
 */

import { NextRequest } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import connectDB from '@/lib/db/connect';
import Media from '@/lib/models/Media';
import { successResponse, errorResponse, handleApiError } from '@/lib/utils/api';
import { requireAuth } from '@/lib/middleware/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const media = await Media.findById(params.id).populate('uploadedBy', 'name email').lean();

    if (!media) {
      return errorResponse('Media not found', 404);
    }

    return successResponse(media);
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

    const media = await Media.findById(params.id);
    if (!media) {
      return errorResponse('Media not found', 404);
    }

    // Delete file from disk
    if (existsSync(media.path)) {
      await unlink(media.path);
    }

    // Delete from database
    await Media.findByIdAndDelete(params.id);

    return successResponse({ message: 'Media deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

