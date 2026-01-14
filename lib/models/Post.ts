/**
 * Post Model
 * Manages blog posts with markdown content and frontmatter
 * Using Supabase PostgreSQL
 */

import { supabaseAdmin } from '@/lib/db/connect';

export interface IPost {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown content with frontmatter
  excerpt?: string;
  tags: string[];
  published: boolean;
  published_at?: string;
  author_id: string;
  views: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface IPostInsert {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
  published_at?: string;
  author_id: string;
  views?: number;
  seo_title?: string;
  seo_description?: string;
}

export interface IPostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  tags?: string[];
  published?: boolean;
  published_at?: string;
  views?: number;
  seo_title?: string;
  seo_description?: string;
}

export interface IPostWithAuthor extends IPost {
  author?: {
    id: string;
    name: string;
    email: string;
  };
}

// Post operations
export const Post = {
  // Find post by ID
  async findById(id: string, includeAuthor = false): Promise<IPostWithAuthor | null> {
    let query = supabaseAdmin
      .from('posts')
      .select(includeAuthor ? '*, author:users(id, name, email)' : '*')
      .eq('id', id)
      .single();

    const { data, error } = await query;
    if (error || !data) return null;
    return data as IPostWithAuthor;
  },

  // Find post by slug
  async findBySlug(slug: string, includeAuthor = false): Promise<IPostWithAuthor | null> {
    let query = supabaseAdmin
      .from('posts')
      .select(includeAuthor ? '*, author:users(id, name, email)' : '*')
      .eq('slug', slug.toLowerCase())
      .single();

    const { data, error } = await query;
    if (error || !data) return null;
    return data as IPostWithAuthor;
  },

  // Find posts with filters
  async find(query: {
    published?: boolean;
    tag?: string;
    page?: number;
    limit?: number;
    includeAuthor?: boolean;
  }): Promise<{ posts: IPostWithAuthor[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('posts')
      .select(query.includeAuthor ? '*, author:users(id, name, email)' : '*', { count: 'exact' });

    if (query.published !== undefined) {
      dbQuery = dbQuery.eq('published', query.published);
    }

    if (query.tag) {
      dbQuery = dbQuery.contains('tags', [query.tag]);
    }

    dbQuery = dbQuery
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    const { data, error, count } = await dbQuery;
    if (error) throw error;

    return {
      posts: (data || []) as IPostWithAuthor[],
      total: count || 0,
    };
  },

  // Count posts
  async count(query?: { published?: boolean }): Promise<number> {
    let dbQuery = supabaseAdmin.from('posts').select('*', { count: 'exact', head: true });

    if (query?.published !== undefined) {
      dbQuery = dbQuery.eq('published', query.published);
    }

    const { count, error } = await dbQuery;
    if (error) throw error;
    return count || 0;
  },

  // Create post
  async create(postData: IPostInsert): Promise<IPost> {
    const { data, error } = await supabaseAdmin
      .from('posts')
      .insert({
        ...postData,
        slug: postData.slug.toLowerCase(),
        tags: postData.tags || [],
        published: postData.published ?? false,
        views: postData.views || 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data as IPost;
  },

  // Update post
  async update(id: string, postData: IPostUpdate): Promise<IPost> {
    const updateData: any = { ...postData };
    if (updateData.slug) {
      updateData.slug = updateData.slug.toLowerCase();
    }

    const { data, error } = await supabaseAdmin
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as IPost;
  },

  // Increment views
  async incrementViews(id: string): Promise<void> {
    const { error } = await supabaseAdmin.rpc('increment_post_views', { post_id: id });
    // If RPC doesn't exist, use update
    if (error) {
      const post = await this.findById(id);
      if (post) {
        await this.update(id, { views: post.views + 1 });
      }
    }
  },

  // Delete post
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export default Post;
