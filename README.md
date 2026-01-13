# Portfolio CMS

A modern, headless content management system built with Next.js, MongoDB, and TypeScript.

## Features

- **Project Management**: Create, edit, and manage portfolio projects
- **Blog Management**: Markdown-based blog posts with frontmatter
- **Media Library**: Upload and manage images and files
- **REST API**: Full CRUD operations via API endpoints
- **Public API**: Read-only endpoints for content delivery
- **Admin Dashboard**: Beautiful, responsive admin interface

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **State Management**: React Query
- **Editor**: react-markdown with remark plugins

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure MongoDB connection in `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/portfolio-cms
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (admin)/           # Admin dashboard routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
├── lib/                   # Utilities and helpers
│   ├── db/               # Database connection
│   ├── models/           # Mongoose models
│   └── schemas/          # Zod validation schemas
├── types/                 # TypeScript type definitions
└── public/                # Static assets
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

