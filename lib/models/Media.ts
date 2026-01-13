/**
 * Media Model
 * Manages uploaded files and images
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  alt?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
    },
    originalName: {
      type: String,
      required: [true, 'Original name is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    size: {
      type: Number,
      required: [true, 'Size is required'],
    },
    path: {
      type: String,
      required: [true, 'Path is required'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
    },
    alt: {
      type: String,
      trim: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
MediaSchema.index({ mimeType: 1 });
MediaSchema.index({ createdAt: -1 });

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

