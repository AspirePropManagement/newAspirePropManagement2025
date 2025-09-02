'use client';

import React, { useState } from 'react';
import { PropertyImageManager } from '../../components/PropertyImageManager';
import { PropertyImages } from '../../types/Property';

export default function DemoImageUploadPage() {
  const [propertyImages, setPropertyImages] = useState<PropertyImages>({});

  const handleImagesChange = (images: PropertyImages) => {
    setPropertyImages(images);
    console.log('Updated property images:', images);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🏠 Property Image Upload Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Clean, professional interface for uploading property photos and floor plans with enhanced UI and full-width layout
          </p>
        </div>

        {/* Demo Content */}
        <div className="space-y-12">
          {/* Resale Property Demo */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              📸 Resale Property - Enhanced Image Upload
            </h2>
            <PropertyImageManager
              initialImages={propertyImages}
              onImagesChange={handleImagesChange}
            />
          </div>

          {/* Current Data Display */}
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              📊 Current Uploaded Data
            </h3>
            <div className="bg-gray-100 rounded-lg p-6 overflow-auto">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(propertyImages, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
