'use client';

import React, { useState, useCallback, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { 
  PhotoIcon, 
  DocumentIcon, 
  TrashIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface PropertyImages {
  general_photos?: {
    exterior?: string[];
    interior?: string[];
    bedrooms?: string[];
    kitchen?: string[];
    bathrooms?: string[];
    amenities?: string[];
  };
  floor_plans?: {
    floor_plan?: string[];
    site_plan?: string[];
    blueprint?: string[];
    elevation?: string[];
    legal_docs?: string[];
  };
}

interface PropertyImageManagerProps {
  isSubmitting?: boolean;
  onImagesChange?: (images: PropertyImages) => void;
  initialImages?: PropertyImages;
}

export interface PropertyImageManagerRef {
  getImages: () => PropertyImages;
  setImages: (images: PropertyImages) => void;
}

export const PropertyImageManager = forwardRef<PropertyImageManagerRef, PropertyImageManagerProps>(({ 
  isSubmitting = false,
  onImagesChange,
  initialImages = {}
}, ref) => {
  // Initialize with provided images or empty object
  const [localImages, setLocalImages] = useState<PropertyImages>(initialImages);
  const [activeCategory, setActiveCategory] = useState<'general_photos' | 'floor_plans'>('general_photos');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('exterior');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local images when initialImages prop changes
  React.useEffect(() => {
    if (Object.keys(initialImages).length > 0) {
      setLocalImages(initialImages);
    }
  }, [initialImages]);

  // Expose methods to parent through ref
  useImperativeHandle(ref, () => ({
    getImages: () => localImages,
    setImages: (images: PropertyImages) => setLocalImages(images)
  }), [localImages]);

  // Notify parent when images change
  React.useEffect(() => {
    if (onImagesChange) {
      onImagesChange(localImages);
    }
  }, [localImages, onImagesChange]);

  // Memoize categories to prevent recreation
  const IMAGE_CATEGORIES = useMemo(() => ({
    general_photos: {
      name: 'General Photos',
      description: 'Property photos and visual content',
      icon: PhotoIcon,
      subcategories: {
        exterior: { name: 'Exterior Views', description: 'Building facade, garden, parking' },
        interior: { name: 'Interior Views', description: 'Hall, living areas, common spaces' },
        bedrooms: { name: 'Bedrooms', description: 'All bedroom types and sizes' },
        kitchen: { name: 'Kitchen', description: 'Kitchen area and appliances' },
        bathrooms: { name: 'Bathrooms', description: 'Bathroom facilities' },
        amenities: { name: 'Amenities', description: 'Gym, pool, clubhouse, etc.' }
      }
    },
    floor_plans: {
      name: 'Floor Plans & Documents',
      description: 'Technical drawings and legal documents',
      icon: DocumentIcon,
      subcategories: {
        floor_plan: { name: 'Floor Plan', description: 'Detailed room layouts' },
        site_plan: { name: 'Site Plan', description: 'Property site layout' },
        blueprint: { name: 'Blueprint', description: 'Technical blueprints' },
        elevation: { name: 'Elevation', description: 'Building elevation views' },
        legal_docs: { name: 'Legal Documents', description: 'Property papers, approvals' }
      }
    }
  }), []);

  // Memoize calculations to prevent recalculation on every render
  const { totalImages, qualityScore } = useMemo(() => {
    let total = 0;
    Object.values(localImages).forEach(category => {
      if (category) {
        Object.values(category).forEach(subcategory => {
          if (Array.isArray(subcategory)) {
            total += subcategory.length;
          }
        });
      }
    });

    let score = 0;
    if (total === 0) score = 0;
    else if (total < 5) score = 25;
    else if (total < 10) score = 50;
    else if (total < 15) score = 75;
    else score = 100;

    return { totalImages: total, qualityScore: score };
  }, [localImages]);

  const handleFileUpload = useCallback((files: FileList) => {
    if (isSubmitting) return; // Prevent uploads while submitting

    const newImages = { ...localImages };
    
    if (!newImages[activeCategory]) {
      newImages[activeCategory] = {};
    }
    if (!newImages[activeCategory]![activeSubcategory as keyof typeof newImages[typeof activeCategory]]) {
      (newImages[activeCategory] as any)[activeSubcategory] = [];
    }

    Array.from(files).forEach((file) => {
      // Create a mock URL for demonstration and store file info
      const mockUrl = URL.createObjectURL(file);
      const fileInfo = {
        url: mockUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
      (newImages[activeCategory] as any)[activeSubcategory].push(fileInfo);
    });

    // Only update local state, never notify parent
    setLocalImages(newImages);
  }, [localImages, activeCategory, activeSubcategory, isSubmitting]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const removeImage = useCallback((category: string, subcategory: string, index: number) => {
    if (isSubmitting) return; // Prevent removal while submitting
    
    const newImages: PropertyImages = { ...localImages };

    // Type-safe access to category and subcategory
    if (
      Object.prototype.hasOwnProperty.call(newImages, category) &&
      Array.isArray((newImages as any)[category]?.[subcategory])
    ) {
      const subcatImages = (newImages as any)[category][subcategory] as Array<{ url: string }>;
      const fileInfo = subcatImages[index];
      if (fileInfo && typeof fileInfo.url === 'string' && fileInfo.url.startsWith('blob:')) {
        URL.revokeObjectURL(fileInfo.url);
      }
      subcatImages.splice(index, 1);
      
      setLocalImages(newImages);
    }
  }, [localImages, isSubmitting]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as 'general_photos' | 'floor_plans';
    setActiveCategory(category);
    // Set first subcategory of the new category
    const firstSubcategory = Object.keys(IMAGE_CATEGORIES[category].subcategories)[0];
    setActiveSubcategory(firstSubcategory);
  }, [IMAGE_CATEGORIES]);

  const handleSubcategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveSubcategory(e.target.value);
  }, []);

  const currentCategory = IMAGE_CATEGORIES[activeCategory];
  const currentSubcategory = currentCategory.subcategories[activeSubcategory as keyof typeof currentCategory.subcategories];
  
  // Type assertion to resolve TypeScript inference issues
  const safeSubcategory = currentSubcategory as { name: string; description: string };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PhotoIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
            <p className="text-sm text-gray-600">{totalImages} files uploaded</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Quality Score</p>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${qualityScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">{qualityScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Select Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Category Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Category *
          </label>
          <select
            value={activeCategory}
            onChange={handleCategoryChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Object.entries(IMAGE_CATEGORIES).map(([key, category]) => {
              const Icon = category.icon;
              const categoryImages = localImages[key as keyof PropertyImages];
              let categoryCount = 0;
              
              if (categoryImages) {
                Object.values(categoryImages).forEach(subcategory => {
                  if (Array.isArray(subcategory)) {
                    categoryCount += subcategory.length;
                  }
                });
              }

              return (
                <option key={key} value={key}>
                  {category.name} {categoryCount > 0 ? `(${categoryCount})` : ''}
                </option>
              );
            })}
          </select>
        </div>

        {/* Subcategory Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Type *
          </label>
          <select
            value={activeSubcategory}
            onChange={handleSubcategoryChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {Object.entries(currentCategory.subcategories).map(([key, subcategory]) => {
              const imageCount = (localImages[activeCategory] as any)?.[key]?.length || 0;
              
              return (
                <option key={key} value={key}>
                  {subcategory.name} {imageCount > 0 ? `(${imageCount})` : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <PhotoIcon className="h-8 w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Upload {safeSubcategory?.name || 'Images'}
            </p>
            <p className="text-gray-600 mt-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports: JPG, PNG, PDF (Max 10MB each)
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Choose Files
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isSubmitting}
        />
      </div>

      {/* Uploaded Files Display */}
      {(localImages[activeCategory] as any)?.[activeSubcategory] && 
       (localImages[activeCategory] as any)[activeSubcategory].length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">
            Uploaded {safeSubcategory?.name || 'Images'}
          </h4>
          <div className="overflow-x-auto">
            <div className="flex space-x-3 pb-2 min-w-max">
              {(localImages[activeCategory] as any)[activeSubcategory].map((fileInfo: any, index: number) => {
                const isPDF = fileInfo.name.includes('.pdf') || fileInfo.type.includes('pdf');
                
                return (
                  <div key={index} className="relative group flex-shrink-0">
                    <div className="bg-white rounded-lg overflow-visible border border-gray-200">
                      {isPDF ? (
                        <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                          <DocumentIcon className="h-10 w-10 text-gray-400" />
                        </div>
                      ) : (
                        <div className="relative">
                          <Image
                            src={fileInfo.url}
                            alt={`Uploaded ${safeSubcategory?.name || 'image'} ${fileInfo.name}`}
                            width={128}
                            height={128}
                            className="object-contain rounded-lg"
                            unoptimized={fileInfo.url.startsWith('blob:')}
                            onError={() => {
                              console.log('Image failed to load:', fileInfo.url);
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Remove Button - Centered trash icon on hover with rounded corners */}
                    <button
                      onClick={() => removeImage(activeCategory, activeSubcategory, index)}
                      disabled={isSubmitting}
                      className="absolute inset-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-red-600 transition-colors">
                        <TrashIcon className="h-6 w-6" />
                      </div>
                    </button>
                    
                    {/* File Info - Show actual filename */}
                    <div className="mt-1 text-center">
                      <p className="text-xs text-gray-600 truncate px-1 max-w-32" title={fileInfo.name}>
                        {fileInfo.name.length > 16 ? fileInfo.name.substring(0, 16) + '...' : fileInfo.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PropertyImageManager.displayName = 'PropertyImageManager';
