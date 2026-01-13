/**
 * New Post Page
 * Create a new blog post with markdown editor
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import toast from 'react-hot-toast';
import { generateSlug } from '@/lib/utils/slug';
import { stringifyFrontmatter } from '@/lib/utils/frontmatter';

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState(`---
title: ""
date: "${new Date().toISOString()}"
description: ""
tags: []
published: false
---

# Your content here
`);
  const [published, setPublished] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create post');
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success('Post created successfully');
      router.push('/admin/posts');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
    // Update frontmatter title
    const lines = content.split('\n');
    if (lines[0] === '---') {
      const frontmatterEnd = lines.findIndex((line, i) => i > 0 && line === '---');
      if (frontmatterEnd > 0) {
        const frontmatterLines = lines.slice(1, frontmatterEnd);
        const contentLines = lines.slice(frontmatterEnd + 1);
        const updatedFrontmatter = frontmatterLines.map((line) =>
          line.startsWith('title:') ? `title: "${value}"` : line
        );
        setContent(`---\n${updatedFrontmatter.join('\n')}\n---\n${contentLines.join('\n')}`);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      title: title || undefined,
      slug,
      content,
      excerpt: excerpt || undefined,
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      published,
      publishedAt: published ? new Date().toISOString() : undefined,
      seoTitle: seoTitle || undefined,
      seoDescription: seoDescription || undefined,
    };
    createMutation.mutate(submitData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title *"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              placeholder="My Awesome Post"
            />
            <Input
              label="Slug *"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="my-awesome-post"
            />
          </div>

          <Textarea
            label="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="A brief summary of your post..."
          />

          <Input
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="react, nextjs, tutorial"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="SEO optimized title"
              maxLength={60}
            />
            <Textarea
              label="SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              placeholder="SEO meta description"
              maxLength={160}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Content</h2>
            <p className="text-sm text-gray-500 mt-1">
              Use frontmatter for metadata. Title, date, description, and tags can be set in the frontmatter.
            </p>
          </div>
          <div className="h-[600px]">
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write your post content in markdown..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {createMutation.isPending ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}

