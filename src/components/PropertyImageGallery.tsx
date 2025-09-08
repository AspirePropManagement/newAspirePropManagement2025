'use client';

import React, { useState } from 'react';
import { PropertyImages } from '@/types/Property';
import Image from 'next/image';

interface PropertyImageGalleryProps {
  images: PropertyImages;
  className?: string;
}

/**
 * Comprehensive image gallery component that displays all property images
 * organized by categories with lightbox functionality
 */
export function PropertyImageGallery({ images, className = '' }: PropertyImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('exterior');

  // Get all available image categories
  const getImageCategories = () => {
    const categories = [];
    
    if (images.general_photos) {
      Object.keys(images.general_photos).forEach(key => {
        if (images.general_photos![key as keyof typeof images.general_photos]?.length) {
          categories.push({
            id: key,
            name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count: images.general_photos![key as keyof typeof images.general_photos]?.length || 0,
            type: 'general'
          });
        }
      });
    }

    if (images.project_images) {
      Object.keys(images.project_images).forEach(key => {
        if (images.project_images![key as keyof typeof images.project_images]?.length) {
          categories.push({
            id: key,
            name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            count: images.project_images![key as keyof typeof images.project_images]?.length || 0,
            type: 'project'
          });
        }
      });
    }

    return categories;
  };

  const categories = getImageCategories();
  const currentImages = selectedCategory === 'exterior' 
    ? images.general_photos?.exterior || []
    : selectedCategory === 'interior'
    ? images.general_photos?.interior || []
    : selectedCategory === 'bedrooms'
    ? images.general_photos?.bedrooms || []
    : selectedCategory === 'kitchen'
    ? images.general_photos?.kitchen || []
    : selectedCategory === 'bathrooms'
    ? images.general_photos?.bathrooms || []
    : selectedCategory === 'living_dining'
    ? images.general_photos?.living_dining || []
    : selectedCategory === 'balcony'
    ? images.general_photos?.balcony || []
    : selectedCategory === 'amenities'
    ? images.general_photos?.amenities || []
    : selectedCategory === 'club_house'
    ? images.project_images?.club_house || []
    : selectedCategory === 'swimming_pool'
    ? images.project_images?.swimming_pool || []
    : selectedCategory === 'gym'
    ? images.project_images?.gym || []
    : selectedCategory === 'children_play_area'
    ? images.project_images?.children_play_area || []
    : selectedCategory === 'park'
    ? images.project_images?.park || []
    : selectedCategory === 'reception_lounge'
    ? images.project_images?.reception_lounge || []
    : selectedCategory === 'banquet_hall'
    ? images.project_images?.banquet_hall || []
    : selectedCategory === 'retail_area'
    ? images.project_images?.retail_area || []
    : selectedCategory === 'parking_area'
    ? images.project_images?.parking_area || []
    : [];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Category Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {categories.find(c => c.id === selectedCategory)?.name} Images
          </h3>
          <span className="text-sm text-gray-500">
            {currentImages.length} image{currentImages.length !== 1 ? 's' : ''}
          </span>
        </div>

        {currentImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                onClick={() => setSelectedImage(imageUrl)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={imageUrl}
                    alt={`${selectedCategory} image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white bg-opacity-90 rounded-full p-1">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
            <p className="text-gray-500">No {selectedCategory.replace('_', ' ')} images have been uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative">
              <Image
                src={selectedImage}
                alt="Full size image"
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
