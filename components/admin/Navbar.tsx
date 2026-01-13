/**
 * Admin Navbar Component
 * Top navigation bar for admin dashboard
 */

'use client';

import { User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="h-5 w-5" />
            <span className="text-sm">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

