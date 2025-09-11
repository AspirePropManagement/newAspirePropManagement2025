'use client';

import React, { useState } from 'react';
import { useShare } from '@/hooks/useShare';
import { generatePropertyShareUrl, generateSocialShareUrls, trackShareEvent, ShareableProperty } from '@/utils/shareUtils';
import { 
  ShareIcon, 
  ClipboardDocumentIcon, 
  CheckIcon, 
  XMarkIcon,
  LinkIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
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
}

/**
 * Advanced share modal with multiple sharing options
 * Includes social media sharing, email, and direct link copying
 */
export function ShareModal({ isOpen, onClose, property }: ShareModalProps) {
  const { shareProperty, copyToClipboard, isCopied } = useShare();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate the property URL using utility function
  const propertyUrl = property.id && property.type 
    ? generatePropertyShareUrl(property as ShareableProperty)
    : (typeof window !== 'undefined' ? window.location.href : '');
  
  const shareText = `Check out this ${property.bhkType || property.propertyType || 'property'} in ${property.location}. ${property.carpetArea ? `Carpet Area: ${property.carpetArea} sq ft. ` : ''}Price: ₹${property.price.toLocaleString('en-IN')}`;
  
  // Generate social share URLs using utility function
  const socialShareUrls = generateSocialShareUrls(property as ShareableProperty, propertyUrl);
  
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: '💬',
      url: socialShareUrls.whatsapp,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Facebook',
      icon: '📘',
      url: socialShareUrls.facebook,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: socialShareUrls.twitter,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: socialShareUrls.linkedin,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      url: socialShareUrls.telegram,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Email',
      icon: '📧',
      url: socialShareUrls.email,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  const handleCopy = async (text: string, item: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedItem(item);
      setTimeout(() => setCopiedItem(null), 2000);
    }
  };

  const handleNativeShare = async () => {
    await shareProperty(property);
  };

  const handleSocialShare = (url: string, platform: string) => {
    // Track the social share event
    if (property.id && property.type) {
      trackShareEvent(property as ShareableProperty, platform, propertyUrl);
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ShareIcon className="w-5 h-5 mr-2" />
            Share Property
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Property Info */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-1">{property.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{property.location}</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{property.price.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Native Share */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShareIcon className="w-5 h-5 mr-2" />
            Share via Device
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Use your device&apos;s native sharing options
          </p>
        </div>

        {/* Social Media Sharing */}
        <div className="p-6 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-4">Share on Social Media</h4>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((social) => (
              <button
                key={social.name}
                onClick={() => handleSocialShare(social.url, social.name.toLowerCase())}
                className={`${social.color} text-white px-4 py-3 rounded-lg flex items-center justify-center transition-colors`}
              >
                <span className="text-lg mr-2">{social.icon}</span>
                {social.name}
              </button>
            ))}
          </div>
        </div>

        {/* Copy Options */}
        <div className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Copy to Clipboard</h4>
          
          {/* Copy Link */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Link
            </label>
            <div className="flex">
              <input
                type="text"
                value={propertyUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm truncate"
                title={propertyUrl}
              />
              <button
                onClick={() => handleCopy(propertyUrl, 'link')}
                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors flex-shrink-0"
              >
                {copiedItem === 'link' ? (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Copy Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share Text
            </label>
            <div className="flex">
              <textarea
                value={shareText}
                readOnly
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm resize-none"
              />
              <button
                onClick={() => handleCopy(shareText, 'text')}
                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
              >
                {copiedItem === 'text' ? (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <ClipboardDocumentIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Copy HTML Embed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTML Embed Code
            </label>
            <div className="flex">
              <textarea
                value={`<a href="${propertyUrl}" target="_blank">${property.title}</a>`}
                readOnly
                rows={2}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg text-sm resize-none font-mono"
              />
              <button
                onClick={() => handleCopy(`<a href="${propertyUrl}" target="_blank">${property.title}</a>`, 'html')}
                className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
              >
                {copiedItem === 'html' ? (
                  <CheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <CodeBracketIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Share this property with friends and family
          </p>
        </div>
      </div>
    </div>
  );
}
