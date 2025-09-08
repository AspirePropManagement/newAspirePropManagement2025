'use client';

import React, { useState, useRef } from 'react';
import { 
  BoldIcon, 
  ItalicIcon, 
  ListBulletIcon,
  LinkIcon,
  PhotoIcon,
  MinusIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon
} from '@heroicons/react/24/outline';

interface SimpleTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Simple Text Editor with HTML formatting toolbar
 * Uses native textarea with HTML formatting functions
 * No external dependencies - always works
 */
export default function SimpleTextEditor({ 
  content, 
  onChange, 
  placeholder = "Start writing...",
  className = ""
}: SimpleTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([content]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const insertText = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    onChange(newText);
    
    // Update cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = content.substring(0, start) + text + content.substring(start);
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const addToHistory = (newContent: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  };

  const handleContentChange = (newContent: string) => {
    onChange(newContent);
    addToHistory(newContent);
  };

  const formatBold = () => insertText('<b>', '</b>');
  const formatItalic = () => insertText('<i>', '</i>');
  const formatStrike = () => insertText('<s>', '</s>');
  const formatCode = () => insertText('<code>', '</code>');
  const formatHeading1 = () => insertText('<h1>', '</h1>');
  const formatHeading2 = () => insertText('<h2>', '</h2>');
  const formatHeading3 = () => insertText('<h3>', '</h3>');
  const formatBulletList = () => insertText('<ul>\n<li>', '</li>\n</ul>');
  const formatNumberedList = () => insertText('<ol>\n<li>', '</li>\n</ol>');
  const formatQuote = () => insertText('<blockquote>', '</blockquote>');
  const formatCodeBlock = () => insertText('<pre><code>', '</code></pre>');
  const formatHorizontalRule = () => insertAtCursor('<hr>');
  
  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      insertText(`<a href="${url}">`, '</a>');
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      insertAtCursor(`<img src="${url}" alt="Image" style="max-width: 100%; height: auto;">`);
    }
  };

  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={formatBold}
              className="p-2 rounded hover:bg-gray-200"
              title="Bold"
            >
              <BoldIcon className="h-4 w-4" />
            </button>
            <button
              onClick={formatItalic}
              className="p-2 rounded hover:bg-gray-200"
              title="Italic"
            >
              <ItalicIcon className="h-4 w-4" />
            </button>
            <button
              onClick={formatStrike}
              className="p-2 rounded hover:bg-gray-200"
              title="Strikethrough"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <button
              onClick={formatCode}
              className="p-2 rounded hover:bg-gray-200"
              title="Inline Code"
            >
              <span className="text-sm font-mono">{"</>"}</span>
            </button>
          </div>

          {/* Headings */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={formatHeading1}
              className="p-2 rounded hover:bg-gray-200"
              title="Heading 1"
            >
              H1
            </button>
            <button
              onClick={formatHeading2}
              className="p-2 rounded hover:bg-gray-200"
              title="Heading 2"
            >
              H2
            </button>
            <button
              onClick={formatHeading3}
              className="p-2 rounded hover:bg-gray-200"
              title="Heading 3"
            >
              H3
            </button>
          </div>

          {/* Lists */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={formatBulletList}
              className="p-2 rounded hover:bg-gray-200"
              title="Bullet List"
            >
              <ListBulletIcon className="h-4 w-4" />
            </button>
            <button
              onClick={formatNumberedList}
              className="p-2 rounded hover:bg-gray-200"
              title="Numbered List"
            >
              <span className="text-sm">1.</span>
            </button>
          </div>

          {/* Block Elements */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={formatQuote}
              className="p-2 rounded hover:bg-gray-200"
              title="Quote"
            >
              <span className="text-sm">&quot;</span>
            </button>
            <button
              onClick={formatCodeBlock}
              className="p-2 rounded hover:bg-gray-200"
              title="Code Block"
            >
              <span className="text-sm font-mono">{"</>"}</span>
            </button>
            <button
              onClick={formatHorizontalRule}
              className="p-2 rounded hover:bg-gray-200"
              title="Horizontal Rule"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Media & Links */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              onClick={addLink}
              className="p-2 rounded hover:bg-gray-200"
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
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <ArrowUturnLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <ArrowUturnRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px]">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-full p-4 border-0 resize-none focus:outline-none focus:ring-0 font-mono text-sm"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-2 bg-gray-50 rounded-b-lg flex justify-between items-center text-sm text-gray-500">
        <div>
          Characters: {charCount} | Words: {wordCount}
        </div>
        <div className="text-xs">
          💡 <strong>HTML Editor:</strong> Use toolbar buttons or type HTML tags directly
        </div>
      </div>
    </div>
  );
}
