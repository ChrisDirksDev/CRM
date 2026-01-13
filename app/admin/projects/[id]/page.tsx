/**
 * Edit Project Page
 * Edit an existing project
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ConfirmModal from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';
import { generateSlug } from '@/lib/utils/slug';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const projectId = params.id as string;
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      const data = await res.json();
      return data.data;
    },
  });

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

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        slug: project.slug || '',
        description: project.description || '',
        content: project.content || '',
        githubLink: project.githubLink || '',
        demoLink: project.demoLink || '',
        technologies: project.technologies?.join(', ') || '',
        featured: project.featured || false,
        published: project.published || false,
        seoTitle: project.seoTitle || '',
        seoDescription: project.seoDescription || '',
      });
    }
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update project');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${projectId}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete project');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
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
    };
    updateMutation.mutate(submitData);
  };

  if (isLoading) {
    return <div className="text-gray-600">Loading project...</div>;
  }

  if (!project) {
    return <div className="text-gray-600">Project not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        </div>
        <Button
          variant="danger"
          onClick={() => setDeleteConfirm(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />
          <Input
            label="Slug *"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            required
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
        />

        <Textarea
          label="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={10}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="GitHub Link"
            type="url"
            value={formData.githubLink}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, githubLink: e.target.value }))
            }
          />
          <Input
            label="Demo Link"
            type="url"
            value={formData.demoLink}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, demoLink: e.target.value }))
            }
          />
        </div>

        <Input
          label="Technologies (comma-separated)"
          value={formData.technologies}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, technologies: e.target.value }))
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SEO Title"
            value={formData.seoTitle}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, seoTitle: e.target.value }))
            }
            maxLength={60}
          />
          <Textarea
            label="SEO Description"
            value={formData.seoDescription}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, seoDescription: e.target.value }))
            }
            rows={2}
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
          <Button type="submit" disabled={updateMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>

      <ConfirmModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

