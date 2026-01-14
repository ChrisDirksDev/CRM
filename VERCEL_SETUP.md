# Vercel & Supabase Setup Guide

This project is configured for deployment on Vercel with Supabase as the database.

## Environment Variables

Add these environment variables in your Vercel project settings:

### Required Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Optional Variables

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the SQL from `supabase-schema.sql`
3. Copy your project URL and API keys from Settings > API
4. Add the environment variables to Vercel

## Database Schema

The database includes the following tables:
- `users` - User authentication and management
- `posts` - Blog posts with markdown content
- `projects` - Portfolio projects
- `media` - Uploaded files and images
- `settings` - Global CMS settings

## Vercel Configuration

The project includes `vercel.json` with:
- Serverless function configuration
- 30-second timeout for API routes
- Next.js framework detection
- Region: `iad1` (US East)

## Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

The project will automatically build and deploy as serverless functions.

## Local Development

1. Copy environment variables to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Notes

- All API routes are serverless functions optimized for Vercel
- Database connection uses connection pooling for serverless environments
- File uploads currently use local storage (consider migrating to Supabase Storage for production)
