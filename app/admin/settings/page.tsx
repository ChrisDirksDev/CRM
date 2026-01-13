/**
 * Settings Page
 * Manage CMS settings
 */

'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    siteName: 'Portfolio CMS',
    siteDescription: 'A modern headless CMS',
    siteUrl: 'http://localhost:3000',
    contactEmail: '',
    github: '',
    twitter: '',
    linkedin: '',
    defaultTitle: '',
    defaultDescription: '',
    defaultImage: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings API endpoint
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h2>
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={formData.siteName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, siteName: e.target.value }))
              }
            />
            <Textarea
              label="Site Description"
              value={formData.siteDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, siteDescription: e.target.value }))
              }
              rows={2}
            />
            <Input
              label="Site URL"
              type="url"
              value={formData.siteUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, siteUrl: e.target.value }))
              }
            />
            <Input
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, contactEmail: e.target.value }))
              }
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h2>
          <div className="space-y-4">
            <Input
              label="GitHub"
              type="url"
              value={formData.github}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, github: e.target.value }))
              }
              placeholder="https://github.com/username"
            />
            <Input
              label="Twitter"
              type="url"
              value={formData.twitter}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, twitter: e.target.value }))
              }
              placeholder="https://twitter.com/username"
            />
            <Input
              label="LinkedIn"
              type="url"
              value={formData.linkedin}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
              }
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Defaults</h2>
          <div className="space-y-4">
            <Input
              label="Default SEO Title"
              value={formData.defaultTitle}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, defaultTitle: e.target.value }))
              }
              maxLength={60}
            />
            <Textarea
              label="Default SEO Description"
              value={formData.defaultDescription}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, defaultDescription: e.target.value }))
              }
              rows={2}
              maxLength={160}
            />
            <Input
              label="Default SEO Image URL"
              type="url"
              value={formData.defaultImage}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, defaultImage: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

