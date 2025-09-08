'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useShare } from '@/hooks/useShare';
import { useToast } from '@/hooks/useToast';
import { generatePropertyShareUrl, generateSocialShareUrls, trackShareEvent, truncateUrl } from '@/utils/shareUtils';
import { 
  ShareIcon, 
  ClipboardDocumentIcon, 
  CheckIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface ShareButtonDropdownProps {
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
  onShowSuccess?: (message: string) => void;
  onShowError?: (message: string) => void;
  onShowInfo?: (message: string) => void;
}

/**
 * Share button with dropdown menu for quick access to different sharing options
 * Consolidates all sharing functionality into a single button
 */
export function ShareButtonDropdown({ 
  property, 
  variant = 'default', 
  size = 'md',
  className = '',
  onShowSuccess,
  onShowError,
  onShowInfo
}: ShareButtonDropdownProps) {
  const { shareProperty, copyToClipboard, isCopied, isSharing } = useShare();
  const { showSuccess: internalShowSuccess, showError: internalShowError } = useToast();
  
  // Use external toast functions if provided, otherwise use internal ones
  const showSuccess = onShowSuccess || internalShowSuccess;
  const showError = onShowError || internalShowError;
  const showInfo = onShowInfo || internalShowSuccess; // Fallback to success for info
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate URLs
  const shareUrl = property.id && property.type 
    ? generatePropertyShareUrl(property)
    : (typeof window !== 'undefined' ? window.location.href : '');
  
  const socialUrls = generateSocialShareUrls(property, shareUrl);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNativeShare = async () => {
    const success = await shareProperty(property);
    if (success) {
      showSuccess('Property shared successfully!');
    } else {
      showError('Failed to share property. Please try again.');
    }
    setIsDropdownOpen(false);
  };

  const handleSocialShare = (url: string, platform: string) => {
    if (property.id && property.type) {
      trackShareEvent(property, platform, shareUrl);
    }
    window.open(url, '_blank', 'width=600,height=400');
    showSuccess(`Opening ${platform}...`);
    setIsDropdownOpen(false);
  };

  const handleCopy = async (text: string, item: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem(item);
      showSuccess(`${item === 'link' ? 'Link' : 'Text'} copied to clipboard!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } else {
      showError('Failed to copy to clipboard. Please try again.');
    }
    setIsDropdownOpen(false);
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
        return 'rounded-full p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-800';
      case 'text':
        return 'text-orange-600 hover:text-orange-800 underline';
      default:
        return 'bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors';
    }
  };

  const socialOptions = [
    { name: 'WhatsApp', icon: '💬', url: socialUrls.whatsapp, color: 'text-green-600' },
    { name: 'Facebook', icon: '📘', url: socialUrls.facebook, color: 'text-blue-600' },
    { name: 'Twitter', icon: '🐦', url: socialUrls.twitter, color: 'text-sky-500' },
    { name: 'LinkedIn', icon: '💼', url: socialUrls.linkedin, color: 'text-blue-700' },
    { name: 'Telegram', icon: '✈️', url: socialUrls.telegram, color: 'text-blue-500' },
    { name: 'Email', icon: '📧', url: socialUrls.email, color: 'text-gray-600' }
  ];

  const renderContent = () => {
    if (variant === 'icon') {
      return <ShareIcon className={getIconSize()} />;
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
        ) : (
          <ShareIcon className={`${getIconSize()} mr-2`} />
        )}
        Share
        <ChevronDownIcon className={`${getIconSize()} ml-1`} />
      </span>
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isSharing}
        className={`
          ${getVariantClasses()}
          ${getSizeClasses()}
          ${isSharing ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}
          transition-all duration-200
          ${className}
        `}
        title="Share this property"
      >
        {renderContent()}
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            {/* Native Share */}
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ShareIcon className="w-5 h-5 mr-3" />
              <div>
                <div className="font-medium">Share via Device</div>
                <div className="text-xs text-gray-500">Use native sharing options</div>
              </div>
            </button>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Social Media Options */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Share on Social Media
              </div>
              {socialOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleSocialShare(option.url, option.name.toLowerCase())}
                  className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-lg mr-3">{option.icon}</span>
                  <span className="font-medium">{option.name}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 my-2"></div>

            {/* Copy Options */}
            <div className="space-y-1">
              <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Copy to Clipboard
              </div>
              <button
                onClick={() => handleCopy(shareUrl, 'link')}
                className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copiedItem === 'link' ? (
                  <CheckIcon className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
                ) : (
                  <ClipboardDocumentIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-medium">Copy Link</div>
                  <div className="text-xs text-gray-500 truncate" title={shareUrl}>
                    {truncateUrl(shareUrl, 40)}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
