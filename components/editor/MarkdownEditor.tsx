/**
 * Markdown Editor Component
 * Markdown editor with live preview
 */

'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Eye, Edit } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  className,
}: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview' | 'split'>('edit');

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className="flex items-center gap-2 p-2 border-b bg-gray-50">
        <Button
          variant={mode === 'edit' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setMode('edit')}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button
          variant={mode === 'preview' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setMode('preview')}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button
          variant={mode === 'split' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setMode('split')}
        >
          Split
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {mode === 'edit' && (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="h-full min-h-[400px] font-mono text-sm resize-none border-0 rounded-none"
          />
        )}
        {mode === 'preview' && (
          <div className="p-4 prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {value || '*No content*'}
            </ReactMarkdown>
          </div>
        )}
        {mode === 'split' && (
          <div className="grid grid-cols-2 h-full">
            <div className="border-r">
              <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-full font-mono text-sm resize-none border-0 rounded-none"
              />
            </div>
            <div className="p-4 prose prose-sm max-w-none overflow-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {value || '*No content*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

