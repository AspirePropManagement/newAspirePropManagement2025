'use client';

import React from 'react';

interface FallbackTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Fallback Text Editor - Simple textarea with basic formatting
 * Used when rich text editor fails to load
 */
export default function FallbackTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  className = ""
}: FallbackTextEditorProps) {
  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Simple Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
        <div className="text-sm text-gray-600">
          <strong>Simple Text Editor</strong> - Use HTML tags for formatting (e.g., &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;h1&gt;heading&lt;/h1&gt;)
        </div>
      </div>

      {/* Textarea */}
      <div className="min-h-[400px]">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full p-4 border-0 resize-none focus:outline-none focus:ring-0"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-2 bg-gray-50 rounded-b-lg text-sm text-gray-500">
        <div>
          Characters: {content.length} | 
          Words: {content.split(/\s+/).filter(word => word.length > 0).length}
        </div>
        <div className="text-xs mt-1">
          💡 <strong>HTML Tips:</strong> Use &lt;b&gt; for bold, &lt;i&gt; for italic, &lt;h1&gt; for headings, &lt;ul&gt;&lt;li&gt; for lists, &lt;a href=&quot;url&quot;&gt; for links
        </div>
      </div>
    </div>
  );
}
