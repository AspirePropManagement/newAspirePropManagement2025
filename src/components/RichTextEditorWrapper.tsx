'use client';

import React, { useState, useEffect } from 'react';
import SimpleTextEditor from './SimpleTextEditor';
import SimpleRichTextEditor from './SimpleRichTextEditor';

interface RichTextEditorWrapperProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Wrapper component for RichTextEditor
 * Uses a reliable HTML contentEditable editor with formatting toolbar
 * Falls back to simple text editor if needed
 */
export default function RichTextEditorWrapper(props: RichTextEditorWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Use the simple rich text editor that works reliably
  if (!isClient) {
    return <SimpleTextEditor {...props} />;
  }

  return <SimpleRichTextEditor {...props} />;
}
