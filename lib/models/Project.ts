/**
 * Project Model
 * Manages portfolio projects
 * Using Supabase PostgreSQL
 */

import { supabaseAdmin } from '@/lib/db/connect';

export interface IProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  images: string[];
  technologies: string[];
  github_link?: string;
  demo_link?: string;
  featured: boolean;
  published: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface IProjectInsert {
  title: string;
  slug: string;
  description: string;
  content?: string;
  images?: string[];
  technologies?: string[];
  github_link?: string;
  demo_link?: string;
  featured?: boolean;
  published?: boolean;
  seo_title?: string;
  seo_description?: string;
}

export interface IProjectUpdate {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  images?: string[];
  technologies?: string[];
  github_link?: string;
  demo_link?: string;
  featured?: boolean;
  published?: boolean;
  seo_title?: string;
  seo_description?: string;
}

// Project operations
export const Project = {
  // Find project by ID
  async findById(id: string): Promise<IProject | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as IProject;
  },

  // Find project by slug
  async findBySlug(slug: string): Promise<IProject | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .single();

    if (error || !data) return null;
    return data as IProject;
  },

  // Find projects with filters
  async find(query: {
    published?: boolean;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ projects: IProject[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('projects')
      .select('*', { count: 'exact' });

    if (query.published !== undefined) {
      dbQuery = dbQuery.eq('published', query.published);
    }

    if (query.featured !== undefined) {
      dbQuery = dbQuery.eq('featured', query.featured);
    }

    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    const { data, error, count } = await dbQuery;
    if (error) throw error;

    return {
      projects: (data || []) as IProject[],
      total: count || 0,
    };
  },

  // Count projects
  async count(query?: { published?: boolean; featured?: boolean }): Promise<number> {
    let dbQuery = supabaseAdmin.from('projects').select('*', { count: 'exact', head: true });

    if (query?.published !== undefined) {
      dbQuery = dbQuery.eq('published', query.published);
    }

    if (query?.featured !== undefined) {
      dbQuery = dbQuery.eq('featured', query.featured);
    }

    const { count, error } = await dbQuery;
    if (error) throw error;
    return count || 0;
  },

  // Create project
  async create(projectData: IProjectInsert): Promise<IProject> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        ...projectData,
        slug: projectData.slug.toLowerCase(),
        images: projectData.images || [],
        technologies: projectData.technologies || [],
        featured: projectData.featured ?? false,
        published: projectData.published ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    return data as IProject;
  },

  // Update project
  async update(id: string, projectData: IProjectUpdate): Promise<IProject> {
    const updateData: any = { ...projectData };
    if (updateData.slug) {
      updateData.slug = updateData.slug.toLowerCase();
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as IProject;
  },

  // Delete project
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export default Project;
