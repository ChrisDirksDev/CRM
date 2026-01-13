/**
 * Frontmatter parsing utilities
 * Handles parsing and validation of markdown frontmatter
 */

import matter from 'gray-matter';

export interface Frontmatter {
  title: string;
  date?: string;
  description?: string;
  tags?: string[];
  published?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  [key: string]: any;
}

/**
 * Parse markdown content with frontmatter
 */
export function parseFrontmatter(content: string): {
  frontmatter: Frontmatter;
  content: string;
} {
  const parsed = matter(content);
  return {
    frontmatter: parsed.data as Frontmatter,
    content: parsed.content,
  };
}

/**
 * Stringify content with frontmatter
 */
export function stringifyFrontmatter(
  frontmatter: Frontmatter,
  content: string
): string {
  return matter.stringify(content, frontmatter);
}

/**
 * Validate required frontmatter fields
 */
export function validateFrontmatter(frontmatter: Frontmatter): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!frontmatter.title) {
    errors.push('Title is required in frontmatter');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

