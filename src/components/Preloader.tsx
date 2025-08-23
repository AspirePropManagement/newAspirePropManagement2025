'use client'

import React from 'react';

interface PreloaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

/**
 * Preloader component displays a loading animation with optional text
 */
export const Preloader: React.FC<PreloaderProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
      {text && (
        <p className={`mt-3 text-gray-600 ${textSizes[size]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

/**
 * Full screen preloader for page-level loading
 */
export const FullScreenPreloader: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <Preloader size="lg" text={text} />
    </div>
  );
};

/**
 * Inline preloader for component-level loading
 */
export const InlinePreloader: React.FC<{ text?: string; className?: string }> = ({ 
  text = 'Loading...',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <Preloader size="md" text={text} />
    </div>
  );
};
