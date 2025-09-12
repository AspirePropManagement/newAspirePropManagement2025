'use client';

import React from 'react';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyImageGallery } from '@/components/PropertyImageGallery';
import { PropertyImages } from '@/types/Property';

/**
 * Demo page showing mixed URL and base64 image support
 * This demonstrates how the application handles both image formats seamlessly
 */
export default function DemoMixedImagesPage() {
  // Sample property with mixed image formats
  const sampleProperty = {
    id: 'demo-1',
    type: 'resale',
    title: 'Luxury Apartment with Mixed Images',
    location: 'Baner, Pune',
    bhk_type: '3_bhk',
    carpet_area: 1200,
    asking_price: 12500000,
    property_images: {
      general_photos: {
        exterior: [
          // URL image
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
          // Base64 image (small red square)
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGYyMTIxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FeHRlcmlvciBCYXNlNjQ8L3RleHQ+PC9zdmc+'
        ],
        interior: [
          // URL image
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop',
          // Base64 image (small blue square)
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzY2M2ZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbnRlcmlvciBCYXNlNjQ8L3RleHQ+PC9zdmc+'
        ],
        bedrooms: [
          // URL image
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
          // Base64 image (small green square)
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMTZiODQ3Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CZWQgQmFzZTY0PC90ZXh0Pjwvc3ZnPg=='
        ],
        kitchen: [
          // URL image
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
          // Base64 image (small orange square)
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjU5NzEwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI0OCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5LaXRjaGVuIEJhc2U2NDwvdGV4dD48L3N2Zz4='
        ]
      }
    }
  };

  const sampleImages: PropertyImages = sampleProperty.property_images;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mixed Image Format Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            This demo shows how the application seamlessly handles both URL and base64 images.
            The property below contains a mix of external URLs and embedded base64 images.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Card Demo */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Property Card</h2>
            <p className="text-gray-600">
              The PropertyCard component automatically detects and handles both image formats.
            </p>
            <PropertyCard property={sampleProperty} />
          </div>

          {/* Image Gallery Demo */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Image Gallery</h2>
            <p className="text-gray-600">
              The PropertyImageGallery component supports mixed formats with category filtering.
            </p>
            <PropertyImageGallery images={sampleImages} />
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Implementation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">URL Images</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• External image URLs (Unsplash, etc.)</li>
                <li>• Configured in next.config.js</li>
                <li>• Optimized by Next.js Image component</li>
                <li>• Cached and served efficiently</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Base64 Images</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Embedded data URLs</li>
                <li>• No external domain configuration needed</li>
                <li>• Unoptimized for immediate display</li>
                <li>• Perfect for uploaded images</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Automatic Detection</h5>
            <p className="text-sm text-gray-600">
              The application automatically detects image format using utility functions and applies the appropriate 
              Next.js Image component settings (optimized for URLs, unoptimized for base64).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
