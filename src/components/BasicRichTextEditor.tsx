'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { 
  BoldIcon, 
  ItalicIcon, 
  CodeIcon,
  ListBulletIcon,
  ListNumberedIcon,
  LinkIcon,
  PhotoIcon,
  QuoteIcon,
  MinusIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline';

interface BasicRichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Basic Rich Text Editor with essential functionality
 * Uses only the most stable TipTap extensions
 */
export default function BasicRichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  className = ""
}: BasicRichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    immediatelyRender: false,
  }, [isMounted]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!isMounted || !editor) {
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
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
              title="Bold"
            >
              <BoldIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
              title="Italic"
            >
              <ItalicIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''}`}
              title="Strikethrough"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-300' : ''}`}
              title="Inline Code"
            >
              <CodeIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
              title="Heading 3"
            >
              H3
            </button>
          </div>

          {/* Lists */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
              title="Bullet List"
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
              title="Numbered List"
            >
              <ListNumberedIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Block Elements */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
              title="Quote"
            >
              <QuoteIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
              title="Code Block"
            >
              <CodeIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-gray-200"
              title="Horizontal Rule"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Media & Links */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={setLink}
              className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''}`}
              title="Add Link"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-200"
              title="Add Image"
            >
              <PhotoIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <ArrowUturnRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-2 bg-gray-50 rounded-b-lg flex justify-between items-center text-sm text-gray-500">
        <div>
          Rich Text Editor - Create formatted content
        </div>
        <div>
          {editor.isActive('link') && (
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="text-red-600 hover:text-red-800"
            >
              Remove Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
