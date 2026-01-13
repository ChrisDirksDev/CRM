/**
 * Dashboard Page
 * Admin dashboard with statistics and recent updates
 */

'use client';

import { useQuery } from '@tanstack/react-query';
import { FolderKanban, FileText, Image, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Stats {
  totalProjects: number;
  totalPosts: number;
  totalMedia: number;
  recentProjects: any[];
  recentPosts: any[];
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      return data.data;
    },
  });

  if (isLoading) {
    return <div className="text-gray-600">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalProjects || 0}
              </p>
            </div>
            <FolderKanban className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalPosts || 0}
              </p>
            </div>
            <FileText className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Media Files</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalMedia || 0}
              </p>
            </div>
            <Image className="h-12 w-12 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Projects
            </h2>
          </div>
          <div className="p-6">
            {stats?.recentProjects && stats.recentProjects.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentProjects.map((project: any) => (
                  <li key={project._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        project.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No projects yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Posts
            </h2>
          </div>
          <div className="p-6">
            {stats?.recentPosts && stats.recentPosts.length > 0 ? (
              <ul className="space-y-4">
                {stats.recentPosts.map((post: any) => (
                  <li key={post._id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{post.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(post.updatedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        post.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No posts yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

