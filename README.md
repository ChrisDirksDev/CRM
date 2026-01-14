# Portfolio CMS

A modern, headless content management system built with Next.js, Supabase, and TypeScript. Optimized for serverless deployment on Vercel.

## Features

- **Project Management**: Create, edit, and manage portfolio projects
- **Blog Management**: Markdown-based blog posts with frontmatter
- **Media Library**: Upload and manage images and files
- **REST API**: Full CRUD operations via API endpoints
- **Public API**: Read-only endpoints for content delivery
- **Admin Dashboard**: Beautiful, responsive admin interface
- **Serverless Ready**: Optimized for Vercel serverless functions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers (Serverless Functions)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Validation**: Zod
- **State Management**: React Query
- **Editor**: react-markdown with remark plugins

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL schema from `supabase-schema.sql` in the Supabase SQL Editor
   - Copy your project URL and API keys

3. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. Seed the database with an admin user:
```bash
npm run seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for detailed deployment instructions.

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes (serverless functions)
│   ├── admin/             # Admin dashboard routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── db/               # Supabase connection
│   ├── models/           # Supabase models and queries
│   └── schemas/          # Zod validation schemas
├── types/                 # TypeScript type definitions
├── supabase-schema.sql    # Database schema
└── vercel.json            # Vercel configuration
```

## API Endpoints

### Admin API (Protected)
- `GET/POST /api/projects` - List/Create projects
- `GET/PUT/DELETE /api/projects/[id]` - Project operations
- `GET/POST /api/posts` - List/Create posts
- `GET/PUT/DELETE /api/posts/[id]` - Post operations
- `GET/POST /api/media` - List/Upload media
- `DELETE /api/media/[id]` - Delete media
- `POST /api/auth/login` - Authentication

### Public API (Read-only)
- `GET /api/public/projects` - Get all projects
- `GET /api/public/projects/[slug]` - Get project by slug
- `GET /api/public/posts` - Get all posts
- `GET /api/public/posts/[slug]` - Get post by slug

