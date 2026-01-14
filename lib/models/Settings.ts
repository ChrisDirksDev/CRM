/**
 * Settings Model
 * Manages global CMS settings
 * Using Supabase PostgreSQL
 */

import { supabaseAdmin } from '@/lib/db/connect';

export interface ISettings {
  id: string;
  site_name: string;
  site_description: string;
  site_url: string;
  contact_email: string;
  social_links: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo: {
    default_title?: string;
    default_description?: string;
    default_image?: string;
  };
  updated_at: string;
}

export interface ISettingsInsert {
  site_name?: string;
  site_description?: string;
  site_url?: string;
  contact_email?: string;
  social_links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo?: {
    default_title?: string;
    default_description?: string;
    default_image?: string;
  };
}

export interface ISettingsUpdate {
  site_name?: string;
  site_description?: string;
  site_url?: string;
  contact_email?: string;
  social_links?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo?: {
    default_title?: string;
    default_description?: string;
    default_image?: string;
  };
}

// Settings operations
export const Settings = {
  // Get settings (ensures only one settings document exists)
  async getSettings(): Promise<ISettings> {
    // Try to get existing settings
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (existing && !fetchError) {
      return existing as ISettings;
    }

    // Create default settings if none exist
    const defaultSettings: ISettingsInsert = {
      site_name: 'Portfolio CMS',
      site_description: 'A modern headless CMS',
      site_url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      contact_email: '',
      social_links: {},
      seo: {},
    };

    const { data, error } = await supabaseAdmin
      .from('settings')
      .insert(defaultSettings)
      .select()
      .single();

    if (error) throw error;
    return data as ISettings;
  },

  // Update settings
  async update(settingsData: ISettingsUpdate): Promise<ISettings> {
    // Ensure settings exist first
    await this.getSettings();

    const { data, error } = await supabaseAdmin
      .from('settings')
      .update(settingsData)
      .limit(1)
      .select()
      .single();

    if (error) throw error;
    return data as ISettings;
  },
};

export default Settings;
