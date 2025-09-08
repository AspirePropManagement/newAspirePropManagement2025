'use client';

import React, { useState, useEffect } from 'react';

interface SimpleRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Simple Rich Text Editor using native HTML contentEditable
 * Fallback editor that works without external dependencies
 */
export default function SimpleRichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  className = ""
}: SimpleRichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    onChange(html);
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const editor = document.getElementById('rich-editor');
    if (editor) {
      onChange(editor.innerHTML);
    }
  };

  const insertLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  if (!isMounted) {
    return (
      <div className={`border border-gray-300 rounded-lg ${className}`}>
        <div className="p-4 bg-gray-50 rounded-t-lg">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="min-h-[400px] flex items-center justify-center bg-white">
          <div className="text-gray-500">Loading editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('bold')}
              className="px-2 py-1 text-sm font-bold hover:bg-gray-200 rounded"
              title="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => execCommand('italic')}
              className="px-2 py-1 text-sm italic hover:bg-gray-200 rounded"
              title="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => execCommand('underline')}
              className="px-2 py-1 text-sm underline hover:bg-gray-200 rounded"
              title="Underline"
            >
              U
            </button>
          </div>

          {/* Headings */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'h1')}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'h2')}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'h3')}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Heading 3"
            >
              H3
            </button>
          </div>

          {/* Lists */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('insertUnorderedList')}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Bullet List"
            >
              •
            </button>
            <button
              type="button"
              onClick={() => execCommand('insertOrderedList')}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Numbered List"
            >
              1.
            </button>
          </div>

          {/* Block Elements */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'blockquote')}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Quote"
            >
              &quot;
            </button>
            <button
              type="button"
              onClick={() => execCommand('formatBlock', 'pre')}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Code Block"
            >
              &lt;/&gt;
            </button>
          </div>

          {/* Media & Links */}
          <div className="flex">
            <button
              type="button"
              onClick={insertLink}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Insert Link"
            >
              🔗
            </button>
            <button
              type="button"
              onClick={insertImage}
              className="px-2 py-1 text-sm hover:bg-gray-200 rounded"
              title="Insert Image"
            >
              🖼️
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        id="rich-editor"
        contentEditable
        onInput={handleInput}
        className="min-h-[400px] p-4 focus:outline-none"
        style={{ minHeight: '400px' }}
        dangerouslySetInnerHTML={{ __html: content }}
        data-placeholder={placeholder}
      />

      {/* Footer */}
      <div className="border-t border-gray-200 p-2 bg-gray-50 rounded-b-lg text-sm text-gray-500">
        <div className="flex justify-between items-center">
          <div>
            Characters: {content.replace(/<[^>]*>/g, '').length} | 
            Words: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
          </div>
          <div className="text-xs">
            💡 <strong>Rich Text Editor:</strong> Use the toolbar above to format your content
          </div>
        </div>
      </div>
    </div>
  );
}