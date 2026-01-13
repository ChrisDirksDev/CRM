/**
 * Settings Model
 * Manages global CMS settings
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  contactEmail: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  seo: {
    defaultTitle?: string;
    defaultDescription?: string;
    defaultImage?: string;
  };
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      default: 'Portfolio CMS',
    },
    siteDescription: {
      type: String,
      default: 'A modern headless CMS',
    },
    siteUrl: {
      type: String,
      default: 'http://localhost:3000',
    },
    contactEmail: {
      type: String,
      default: '',
    },
    socialLinks: {
      github: String,
      twitter: String,
      linkedin: String,
    },
    seo: {
      defaultTitle: String,
      defaultDescription: String,
      defaultImage: String,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

