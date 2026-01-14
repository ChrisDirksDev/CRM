/**
 * Media Model
 * Manages uploaded files and images
 * Using Supabase PostgreSQL
 */

import { supabaseAdmin } from '@/lib/db/connect';

export interface IMedia {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  path: string;
  url: string;
  alt?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface IMediaInsert {
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  path: string;
  url: string;
  alt?: string;
  uploaded_by: string;
}

export interface IMediaUpdate {
  filename?: string;
  original_name?: string;
  mime_type?: string;
  size?: number;
  path?: string;
  url?: string;
  alt?: string;
}

// Media operations
export const Media = {
  // Find media by ID
  async findById(id: string): Promise<IMedia | null> {
    const { data, error } = await supabaseAdmin
      .from('media')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as IMedia;
  },

  // Find all media with filters
  async find(query: {
    mime_type?: string;
    uploaded_by?: string;
    page?: number;
    limit?: number;
  }): Promise<{ media: IMedia[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from('media')
      .select('*', { count: 'exact' });

    if (query.mime_type) {
      dbQuery = dbQuery.eq('mime_type', query.mime_type);
    }

    if (query.uploaded_by) {
      dbQuery = dbQuery.eq('uploaded_by', query.uploaded_by);
    }

    dbQuery = dbQuery
      .order('created_at', { ascending: false })
      .range(skip, skip + limit - 1);

    const { data, error, count } = await dbQuery;
    if (error) throw error;

    return {
      media: (data || []) as IMedia[],
      total: count || 0,
    };
  },

  // Create media
  async create(mediaData: IMediaInsert): Promise<IMedia> {
    const { data, error } = await supabaseAdmin
      .from('media')
      .insert(mediaData)
      .select()
      .single();

    if (error) throw error;
    return data as IMedia;
  },

  // Update media
  async update(id: string, mediaData: IMediaUpdate): Promise<IMedia> {
    const { data, error } = await supabaseAdmin
      .from('media')
      .update(mediaData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as IMedia;
  },

  // Delete media
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

export default Media;
