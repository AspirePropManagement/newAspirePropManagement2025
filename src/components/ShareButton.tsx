'use client';

import React, { useState } from 'react';
import { useShare } from '@/hooks/useShare';
import { ShareIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ShareButtonProps {
  property: {
    title: string;
    location: string;
    price: number;
    bhkType?: string;
    carpetArea?: number;
    propertyType?: string;
    id?: string;
    type?: string;
  };
  variant?: 'default' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showModal?: boolean;
  onModalToggle?: (isOpen: boolean) => void;
}

/**
 * Share button component with Web Share API support and clipboard fallback
 * Provides multiple variants and sizes for different use cases
 */
export function ShareButton({ 
  property, 
  variant = 'default', 
  size = 'md',
  className = '',
  showModal = false,
  onModalToggle
}: ShareButtonProps) {
  const { shareProperty, isCopied, isSharing } = useShare();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = async () => {
    // If modal is enabled, open it instead of direct sharing
    if (showModal && onModalToggle) {
      onModalToggle(true);
      return;
    }
    
    const success = await shareProperty(property);
    if (success && !isCopied) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-6 h-6';
      default:
        return 'w-5 h-5';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'icon':
        return 'rounded-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800';
      case 'text':
        return 'text-blue-600 hover:text-blue-800 underline';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors';
    }
  };

  const renderContent = () => {
    if (variant === 'icon') {
      return (
        <ShareIcon className={getIconSize()} />
      );
    }

    if (variant === 'text') {
      return (
        <span className="flex items-center">
          <ShareIcon className={`${getIconSize()} mr-1`} />
          Share
        </span>
      );
    }

    return (
      <span className="flex items-center">
        {isSharing ? (
          <div className={`${getIconSize()} mr-2 animate-spin`}>
            <div className="w-full h-full border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        ) : isCopied ? (
          <CheckIcon className={`${getIconSize()} mr-2`} />
        ) : (
          <ShareIcon className={`${getIconSize()} mr-2`} />
        )}
        {isCopied ? 'Copied!' : isSharing ? 'Sharing...' : 'Share'}
      </span>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${isSharing ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-200
          ${className}
        `}
        title={isCopied ? 'Link copied to clipboard!' : 'Share this property'}
      >
        {renderContent()}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
            Link copied to clipboard!
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Success message for icon variant */}
      {isCopied && variant === 'icon' && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
          <div className="flex items-center">
            <CheckIcon className="w-3 h-3 mr-1" />
            Copied!
          </div>
        </div>
      )}
    </div>
  );
}
