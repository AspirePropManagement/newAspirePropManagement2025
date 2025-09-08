'use client';

import React, { useState } from 'react';
import { ShareButton } from '@/components/ShareButton';
import { ShareButtonDropdown } from '@/components/ShareButtonDropdown';
import { ShareModal } from '@/components/ShareModal';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ToastContainer';
import { generatePropertyShareUrl, generateShareText, generateSocialShareUrls, truncateUrl } from '@/utils/shareUtils';

/**
 * Test page to demonstrate share functionality
 * Shows different share button variants and URL generation
 */
export default function TestSharePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Sample property for testing
  const testProperty = {
    id: 'test-property-123',
    type: 'resale',
    title: 'Luxury 3 BHK Apartment in Baner',
    location: 'Baner, Pune',
    price: 12500000,
    bhkType: '3 BHK',
    carpetArea: 1200,
    propertyType: 'Apartment'
  };

  // Generate URLs for testing
  const shareUrl = generatePropertyShareUrl(testProperty);
  const shareText = generateShareText(testProperty);
  const socialUrls = generateSocialShareUrls(testProperty, shareUrl);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Share Functionality Test</h1>
        
        {/* Property Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Title:</strong> {testProperty.title}</p>
              <p><strong>Location:</strong> {testProperty.location}</p>
              <p><strong>Price:</strong> ₹{testProperty.price.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p><strong>Type:</strong> {testProperty.propertyType}</p>
              <p><strong>BHK:</strong> {testProperty.bhkType}</p>
              <p><strong>Carpet Area:</strong> {testProperty.carpetArea} sq ft</p>
            </div>
          </div>
        </div>

        {/* Share Button Variants */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Button Variants</h2>
          <div className="space-y-6">
            {/* New Dropdown Variants */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">New Dropdown Share Button (Recommended)</h3>
              <div className="flex flex-wrap gap-4">
                <ShareButtonDropdown property={testProperty} variant="default" size="sm" />
                <ShareButtonDropdown property={testProperty} variant="default" size="md" />
                <ShareButtonDropdown property={testProperty} variant="default" size="lg" />
              </div>
              <div className="mt-4 flex flex-wrap gap-4">
                <ShareButtonDropdown property={testProperty} variant="icon" size="sm" />
                <ShareButtonDropdown property={testProperty} variant="icon" size="md" />
                <ShareButtonDropdown property={testProperty} variant="icon" size="lg" />
              </div>
            </div>

            {/* Legacy Button Variants */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Legacy Share Button (with Modal)</h3>
              <div className="flex flex-wrap gap-4">
                <ShareButton property={testProperty} variant="default" size="sm" showModal={true} onModalToggle={setIsModalOpen} />
                <ShareButton property={testProperty} variant="default" size="md" showModal={true} onModalToggle={setIsModalOpen} />
                <ShareButton property={testProperty} variant="default" size="lg" showModal={true} onModalToggle={setIsModalOpen} />
              </div>
            </div>
          </div>
        </div>

        {/* Generated URLs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generated URLs & Text</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Share URL</h3>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm break-all" title={shareUrl}>{shareUrl}</code>
              </div>
              <div className="mt-2 space-y-2">
                <p className="text-xs text-gray-500">
                  Note: In the dropdown, long URLs will be truncated with ellipsis (...)
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <div className="font-medium text-blue-800">Truncated URL (40 chars):</div>
                  <code className="text-blue-600">{truncateUrl(shareUrl, 40)}</code>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Share Text</h3>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm">{shareText}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Social Media URLs</h3>
              <div className="space-y-2">
                {Object.entries(socialUrls).map(([platform, url]) => (
                  <div key={platform} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <span className="font-medium capitalize">{platform}:</span>
                    <code className="text-xs text-blue-600 break-all">{url}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toast Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Toast Notifications Test</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              Test different types of toast notifications that appear when sharing.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  console.log('Testing success toast');
                  showSuccess('Link copied to clipboard!');
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Success Toast
              </button>
              <button
                onClick={() => {
                  console.log('Testing error toast');
                  showError('Failed to copy to clipboard');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Error Toast
              </button>
              <button
                onClick={() => {
                  console.log('Testing info toast');
                  showInfo('Opening WhatsApp...');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Info Toast
              </button>
            </div>
          </div>
        </div>

        {/* Share Modal Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Modal Test</h2>
          <div className="space-y-4">
            <p className="text-gray-600">
              The new dropdown share button consolidates all functionality. The modal is still available for legacy support.
            </p>
            <div className="flex gap-4">
              <ShareButton 
                property={testProperty}
                variant="default"
                size="md"
                showModal={true}
                onModalToggle={setIsModalOpen}
              />
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Open Modal Directly
              </button>
            </div>
          </div>
        </div>

        {/* URL Testing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">URL Testing</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Test Share URL</h3>
              <p className="text-sm text-gray-600 mb-2">
                Click the link below to test if it opens the property page correctly:
              </p>
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Property Link
              </a>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">URL Parameters</h3>
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  The generated URL includes UTM parameters for tracking:
                </p>
                <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                  <li>utm_source=property_share</li>
                  <li>utm_medium=share_button</li>
                  <li>utm_campaign=property_listing</li>
                  <li>shared_at=timestamp</li>
                  <li>property_id=test-property-123</li>
                  <li>property_type=resale</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        <ShareModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={testProperty}
        />

        {/* Toast Container */}
        <ToastContainer
          toasts={toasts}
          onRemove={removeToast}
        />
      </div>
    </div>
  );
}
