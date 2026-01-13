/**
 * Global type definitions
 */

import { IProject } from '@/lib/models/Project';
import { IPost } from '@/lib/models/Post';
import { IMedia } from '@/lib/models/Media';
import { IUser } from '@/lib/models/User';
import { ISettings } from '@/lib/models/Settings';

export type Project = IProject;
export type Post = IPost;
export type Media = IMedia;
export type User = IUser;
export type Settings = ISettings;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

