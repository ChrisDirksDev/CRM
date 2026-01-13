/**
 * Zod schemas for Project validation
 */

import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().min(1, 'Description is required').max(500),
  content: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  technologies: z.array(z.string()).default([]),
  githubLink: z.string().url().optional().or(z.literal('')),
  demoLink: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

