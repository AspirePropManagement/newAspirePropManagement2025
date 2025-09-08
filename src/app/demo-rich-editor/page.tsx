'use client';

import React, { useState } from 'react';
import RichTextEditorWrapper from '@/components/RichTextEditorWrapper';

/**
 * Demo page for the Rich Text Editor
 * Showcases all the features and capabilities
 */
export default function RichEditorDemoPage() {
  const [content, setContent] = useState(`
    <h1>Welcome to the Rich Text Editor!</h1>
    <p>This is a <strong>full-featured</strong> rich text editor with support for:</p>
    
    <h2>Text Formatting</h2>
    <ul>
      <li><strong>Bold text</strong></li>
      <li><em>Italic text</em></li>
      <u>Underlined text</u></li>
      <li><s>Strikethrough text</s></li>
      <li><code>Inline code</code></li>
      <li><mark>Highlighted text</mark></li>
    </ul>
    
    <h2>Lists</h2>
    <ol>
      <li>Numbered lists</li>
      <li>With multiple items</li>
      <li>Easy to create</li>
    </ol>
    
    <h2>Code Blocks</h2>
    <pre><code class="language-javascript">function hello() {
  console.log("Hello, World!");
  return "Rich text editing!";
}</code></pre>
    
    <h2>Features</h2>
    <ul>
      <li><strong>Bold/Italic</strong> - Full support</li>
      <li><strong>Images</strong> - URL-based insertion</li>
      <li><strong>Links</strong> - Click to add/edit</li>
      <li><strong>Code blocks</strong> - Syntax highlighting</li>
      <li><strong>Lists</strong> - Bulleted and numbered</li>
      <li><strong>Alignment</strong> - Left, center, right, justify</li>
    </ul>
    
    <h2>Quotes</h2>
    <blockquote>
      <p>This is a blockquote. Perfect for highlighting important information or quotes from other sources.</p>
    </blockquote>
    
    <h2>Try it yourself!</h2>
    <p>Use the comprehensive toolbar above to format your text, add media, and create rich content. The PrimeReact Editor supports:</p>
    <ul>
      <li><strong>Text Formatting:</strong> Bold, italic, underline, strikethrough</li>
      <li><strong>Headings:</strong> H1 through H6 with proper hierarchy</li>
      <li><strong>Lists:</strong> Bulleted and numbered lists with indentation</li>
      <li><strong>Media:</strong> Images, videos, and links</li>
      <li><strong>Code:</strong> Inline code and code blocks</li>
      <li><strong>Alignment:</strong> Left, center, right, and justify</li>
      <li><strong>Colors:</strong> Text and background color options</li>
      <li><strong>Advanced:</strong> Blockquotes, clean formatting, and more</li>
    </ul>
    
    <hr>
    
    <p><em>Start editing this content to see the rich text editor in action!</em></p>
  `);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PrimeReact Rich Text Editor Demo</h1>
          <p className="text-gray-600 mb-6">
            Experience the professional PrimeReact Editor powered by Quill with comprehensive formatting, media support, and advanced features!
          </p>
          
          <RichTextEditorWrapper
            content={content}
            onChange={setContent}
            placeholder="Start writing your content here..."
          />
          
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">HTML Output Preview:</h3>
            <pre className="text-sm text-gray-700 overflow-x-auto">
              {content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
