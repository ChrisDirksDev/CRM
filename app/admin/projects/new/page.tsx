/**
 * New Project Page
 * Create a new project
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';
import { generateSlug } from '@/lib/utils/slug';

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    githubLink: '',
    demoLink: '',
    technologies: '',
    featured: false,
    published: false,
    seoTitle: '',
    seoDescription: '',
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create project');
      }
      return res.json();
    },
    onSuccess: (data) => {
      toast.success('Project created successfully');
      router.push('/admin/projects');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      technologies: formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      images: [], // Will be handled separately with media upload
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
        <h1 className="text-3xl font-bold text-gray-900">New Project</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="My Awesome Project"
          />
          <Input
            label="Slug *"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
            placeholder="my-awesome-project"
          />
        </div>

        <Textarea
          label="Description *"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          rows={3}
          placeholder="A brief description of your project..."
        />

        <Textarea
          label="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={10}
          placeholder="Detailed project description in markdown..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="GitHub Link"
            type="url"
            value={formData.githubLink}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubLink: e.target.value }))
            }
            placeholder="https://github.com/username/project"
          />
          <Input
            label="Demo Link"
            type="url"
            value={formData.demoLink}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, demoLink: e.target.value }))
            }
            placeholder="https://demo.example.com"
          />
        </div>

        <Input
          label="Technologies (comma-separated)"
          value={formData.technologies}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, technologies: e.target.value }))
          }
          placeholder="React, TypeScript, Next.js"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SEO Title"
            value={formData.seoTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
            }
            placeholder="SEO optimized title"
            maxLength={60}
          />
          <Textarea
            label="SEO Description"
            value={formData.seoDescription}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))
            }
            rows={2}
            placeholder="SEO meta description"
            maxLength={160}
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, featured: e.target.checked }))
              }
              className="rounded"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, published: e.target.checked }))
              }
              className="rounded"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>
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
            {createMutation.isPending ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}

