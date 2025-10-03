'use client';

import React, { useState } from 'react';
import { PropertyImages } from '@/types/Property';
import Image from 'next/image';
import { getImageSrc, isBase64Image, getImagesByCategory, filterValidImages } from '@/utils/imageUtils';

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
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Debug logging
  console.log('PropertyImageGallery - Received images:', images);

  // Get all available image categories
  const getImageCategories = () => {
    const categories: any[] = [];
    
    console.log('PropertyImageGallery - Checking general_photos:', images.general_photos);
    
    if (images.general_photos) {
      Object.keys(images.general_photos).forEach(key => {
        const categoryImages = images.general_photos![key as keyof typeof images.general_photos];
        console.log(`PropertyImageGallery - Category ${key}:`, categoryImages);
        if (Array.isArray(categoryImages) && categoryImages.length > 0) {
          const validImages = filterValidImages(categoryImages);
          if (validImages.length > 0) {
            categories.push({
              id: key,
              name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              count: validImages.length,
              type: 'general'
            });
          }
        }
      });
    }

    if (images.project_images) {
      Object.keys(images.project_images).forEach(key => {
        const categoryImages = images.project_images![key as keyof typeof images.project_images];
        if (Array.isArray(categoryImages) && categoryImages.length > 0) {
          const validImages = filterValidImages(categoryImages);
          if (validImages.length > 0) {
            categories.push({
              id: key,
              name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              count: validImages.length,
              type: 'project'
            });
          }
        }
      });
    }

    return categories;
  };

  const categories = getImageCategories();
  
  // Set default category to first available category if exterior is not available
  React.useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.id === selectedCategory)) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);
  
  // Reset image errors when category changes
  React.useEffect(() => {
    setImageErrors(new Set());
  }, [selectedCategory]);
  
  // Get current images directly from the images structure
  const getCurrentImages = (category: string) => {
    // Check if it's a general_photos category
    if (images.general_photos && images.general_photos[category as keyof typeof images.general_photos]) {
      const categoryImages = images.general_photos[category as keyof typeof images.general_photos];
      return categoryImages ? filterValidImages(categoryImages) : [];
    }
    // Check if it's a project_images category
    if (images.project_images && images.project_images[category as keyof typeof images.project_images]) {
      const categoryImages = images.project_images[category as keyof typeof images.project_images];
      return categoryImages ? filterValidImages(categoryImages) : [];
    }
    return [];
  };
  
  const currentImages = getCurrentImages(selectedCategory);
  console.log(`PropertyImageGallery - Current images for ${selectedCategory}:`, currentImages);

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Category Tabs */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Image Categories</h3>
        <div className="flex overflow-x-auto scrollbar-hide space-x-2 pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
              <span className="ml-1.5 sm:ml-2 px-1.5 sm:px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {categories.find(c => c.id === selectedCategory)?.name} Images
          </h3>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {currentImages.length} image{currentImages.length !== 1 ? 's' : ''}
          </span>
        </div>

        {currentImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {currentImages.map((imageUrl, index) => {
              const hasError = imageErrors.has(index);
              return (
                <div
                  key={index}
                  className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  onClick={() => !hasError && setSelectedImage(imageUrl)}
                >
                  <div className="aspect-square relative">
                    {!hasError ? (
                      <Image
                        src={getImageSrc(imageUrl)}
                        alt={`${selectedCategory} image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => {
                          setImageErrors(prev => new Set([...Array.from(prev), index]));
                        }}
                        // For base64 images, we don't need to configure domains
                        unoptimized={isBase64Image(imageUrl)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-[10px] sm:text-xs text-gray-500">Image Error</span>
                      </div>
                    )}
                    {!hasError && (
                      <>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white bg-opacity-90 rounded-full p-1">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Images Available</h3>
            <p className="text-sm sm:text-base text-gray-500">No {selectedCategory.replace('_', ' ')} images have been uploaded yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-2 sm:p-4">
          <div className="relative w-full max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 sm:top-4 sm:right-4 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 sm:p-2.5 transition-colors shadow-lg"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative">
              <Image
                src={getImageSrc(selectedImage)}
                alt="Full size image"
                width={800}
                height={600}
                className="max-w-full max-h-[85vh] sm:max-h-[80vh] object-contain rounded-lg"
                // For base64 images, we don't need to configure domains
                unoptimized={isBase64Image(selectedImage)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
