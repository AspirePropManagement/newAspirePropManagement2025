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
    living_dining_balcony?: string[];
    amenities?: string[];
  };
  floor_plans?: {
    floor_plan?: string[];
    site_plan?: string[];
    blueprint?: string[];
    elevation?: string[];
    legal_docs?: string[];
  };
  legal_docs?: string[];
  virtual_content?: string[];
  project_images?: string[];
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
  const [activeCategory, setActiveCategory] = useState<'general_photos' | 'floor_plans' | 'legal_docs' | 'virtual_content' | 'project_images'>('general_photos');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('exterior');
  const [dragOver, setDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local images when initialImages prop changes
  React.useEffect(() => {
    setLocalImages(initialImages);
  }, [initialImages]);

  // Expose methods to parent through ref
  useImperativeHandle(ref, () => ({
    getImages: () => {
      console.log('PropertyImageManager - getImages called, returning:', localImages);
      return localImages;
    },
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
        living_dining_balcony: { name: 'Living area, Dining & Balcony Area', description: 'Living room, dining area, and balcony spaces' },
        amenities: { name: 'Amenities', description: 'Gym, pool, clubhouse, etc.' }
      }
    },
    floor_plans: {
      name: 'Floor Plans',
      description: 'Technical drawings and layouts',
      icon: DocumentIcon,
      subcategories: {
        floor_plan: { name: 'Floor Plan', description: 'Detailed room layouts' },
        site_plan: { name: 'Site Plan', description: 'Property site layout' },
        blueprint: { name: 'Blueprint', description: 'Technical blueprints' },
        elevation: { name: 'Elevation', description: 'Building elevation views' }
      }
    },
    legal_docs: {
      name: 'Legal Documents',
      description: 'Property papers, approvals, certificates',
      icon: DocumentIcon,
      subcategories: {}
    },
    virtual_content: {
      name: 'Virtual Content',
      description: 'Virtual tours, 360° views',
      icon: PhotoIcon,
      subcategories: {}
    },
    project_images: {
      name: 'Project Images',
      description: 'New project renderings, models',
      icon: PhotoIcon,
      subcategories: {}
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
    if (isSubmitting || isUploading) return; // Prevent uploads while submitting or uploading

    setIsUploading(true);
    const newImages = { ...localImages };
    const currentCategory = IMAGE_CATEGORIES[activeCategory];
    
    // Handle categories with subcategories (general_photos, floor_plans)
    if (currentCategory.subcategories && Object.keys(currentCategory.subcategories).length > 0) {
      if (!newImages[activeCategory]) {
        (newImages as any)[activeCategory] = {};
      }
      if (!(newImages as any)[activeCategory][activeSubcategory]) {
        (newImages as any)[activeCategory][activeSubcategory] = [];
      }
    } else {
      // Handle categories without subcategories (legal_docs, virtual_content, project_images)
      if (!newImages[activeCategory]) {
        (newImages as any)[activeCategory] = [];
      }
    }

    // Process all files and collect base64 data
    const filePromises = Array.from(files).map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          if (base64) {
            resolve(base64);
          } else {
            reject(new Error('Failed to convert file to base64'));
          }
        };
        reader.onerror = () => reject(new Error('File reading failed'));
        reader.readAsDataURL(file);
      });
    });

    // Wait for all files to be processed, then update state once
    Promise.all(filePromises)
      .then((base64Results) => {
        console.log('PropertyImageManager - All files converted to base64, storing in:', activeCategory, activeSubcategory);
        
        // Add all base64 results to the appropriate array
        if (currentCategory.subcategories && Object.keys(currentCategory.subcategories).length > 0) {
          // Categories with subcategories
          (newImages as any)[activeCategory][activeSubcategory].push(...base64Results);
        } else {
          // Categories without subcategories
          (newImages as any)[activeCategory].push(...base64Results);
        }
        
        console.log('PropertyImageManager - Updated newImages structure:', newImages);
        setLocalImages({ ...newImages });
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch((error) => {
        console.error('Error processing files:', error);
        alert('Error uploading files. Please try again.');
      })
      .finally(() => {
        setIsUploading(false);
      });
  }, [localImages, activeCategory, activeSubcategory, isSubmitting, isUploading, IMAGE_CATEGORIES]);

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
    const currentCategory = IMAGE_CATEGORIES[category as keyof typeof IMAGE_CATEGORIES];

    // Handle categories with subcategories (general_photos, floor_plans)
    if (currentCategory.subcategories && Object.keys(currentCategory.subcategories).length > 0) {
      if (
        Object.prototype.hasOwnProperty.call(newImages, category) &&
        Array.isArray((newImages as any)[category]?.[subcategory])
      ) {
        const subcatImages = (newImages as any)[category][subcategory] as string[];
        subcatImages.splice(index, 1);
        setLocalImages(newImages);
      }
    } else {
      // Handle categories without subcategories (legal_docs, virtual_content, project_images)
      if (
        Object.prototype.hasOwnProperty.call(newImages, category) &&
        Array.isArray((newImages as any)[category])
      ) {
        const catImages = (newImages as any)[category] as string[];
        catImages.splice(index, 1);
        setLocalImages(newImages);
      }
    }
  }, [localImages, isSubmitting, IMAGE_CATEGORIES]);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value as 'general_photos' | 'floor_plans' | 'legal_docs' | 'virtual_content' | 'project_images';
    setActiveCategory(category);
    // Set first subcategory of the new category (if it has subcategories)
    const categoryData = IMAGE_CATEGORIES[category];
    if (categoryData.subcategories && Object.keys(categoryData.subcategories).length > 0) {
      const firstSubcategory = Object.keys(categoryData.subcategories)[0];
      setActiveSubcategory(firstSubcategory);
    } else {
      // For categories without subcategories, set a default
      setActiveSubcategory('default');
    }
  }, [IMAGE_CATEGORIES]);

  const handleSubcategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveSubcategory(e.target.value);
  }, []);

  const currentCategory = IMAGE_CATEGORIES[activeCategory];
  const currentSubcategory = currentCategory.subcategories[activeSubcategory as keyof typeof currentCategory.subcategories];
  
  // Type assertion to resolve TypeScript inference issues
  const safeSubcategory = currentSubcategory as { name: string; description: string };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Stats - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <PhotoIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Property Images</h3>
            <p className="text-xs sm:text-sm text-gray-600">{totalImages} files uploaded</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="text-right">
            <p className="text-xs sm:text-sm font-medium text-gray-700">Quality Score</p>
            <div className="flex items-center space-x-2">
              <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${qualityScore}%` }}
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-900">{qualityScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Select Dropdowns - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Main Category Select */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            Image Category *
          </label>
          <select
            value={activeCategory}
            onChange={handleCategoryChange}
            disabled={isSubmitting}
            className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base bg-white"
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

        {/* Subcategory Select - Only show for categories with subcategories */}
        {currentCategory.subcategories && Object.keys(currentCategory.subcategories).length > 0 && (
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Image Type *
            </label>
            <select
              value={activeSubcategory}
              onChange={handleSubcategoryChange}
              disabled={isSubmitting}
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base bg-white"
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
        )}
      </div>

      {/* Upload Area - Mobile Responsive */}
      <div
        className={`border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all duration-200 ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isSubmitting || isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <PhotoIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-900">
              Upload {safeSubcategory?.name || 'Images'}
            </p>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Supports: JPG, PNG, PDF (Max 10MB each)
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSubmitting || isUploading}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {isUploading ? 'Uploading...' : 'Choose Files'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isSubmitting || isUploading}
        />
      </div>

      {/* Uploaded Files Display - Mobile Responsive */}
      {(() => {
        const currentCategory = IMAGE_CATEGORIES[activeCategory];
        const hasSubcategories = currentCategory.subcategories && Object.keys(currentCategory.subcategories).length > 0;
        
        if (hasSubcategories) {
          // Categories with subcategories
          return (localImages[activeCategory] as any)?.[activeSubcategory] && 
                 (localImages[activeCategory] as any)[activeSubcategory].length > 0;
        } else {
          // Categories without subcategories
          return (localImages[activeCategory] as any) && 
                 Array.isArray((localImages[activeCategory] as any)) && 
                 (localImages[activeCategory] as any).length > 0;
        }
      })() && (
        <div className="space-y-3 sm:space-y-4">
          <h4 className="text-base sm:text-lg font-medium text-gray-900">
            Uploaded {safeSubcategory?.name || 'Images'}
          </h4>
          <div className="overflow-x-auto">
            <div className="flex space-x-2 sm:space-x-3 pb-2 min-w-max">
              {(() => {
                const currentCategory = IMAGE_CATEGORIES[activeCategory];
                const hasSubcategories = currentCategory.subcategories && Object.keys(currentCategory.subcategories).length > 0;
                
                let imagesToMap: any[] = [];
                if (hasSubcategories) {
                  // Categories with subcategories
                  imagesToMap = (localImages[activeCategory] as any)?.[activeSubcategory] || [];
                } else {
                  // Categories without subcategories
                  imagesToMap = (localImages[activeCategory] as any) || [];
                }
                
                return imagesToMap.map((imageData: any, index: number) => {
                // Ensure imageData is a string before calling string methods
                const imageString = typeof imageData === 'string' ? imageData : String(imageData || '');
                
                // Handle non-base64 images gracefully (existing data that might not be base64)
                if (!imageString.startsWith('data:')) {
                  return (
                    <div key={index} className="relative group flex-shrink-0">
                      <div className="bg-white rounded-lg overflow-visible border border-gray-200">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                          <DocumentIcon className="h-6 w-6 sm:h-10 sm:w-10 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-1 text-center">
                        <p className="text-xs text-gray-600 truncate px-1 max-w-24 sm:max-w-32" title="Non-base64 image">
                          Legacy Image
                        </p>
                      </div>
                    </div>
                  );
                }
                
                const isPDF = imageString.includes('data:application/pdf') || imageString.includes('data:application/octet-stream');
                const isBase64Image = imageString.startsWith('data:image/');
                
                return (
                  <div key={index} className="relative group flex-shrink-0">
                    <div className="bg-white rounded-lg overflow-visible border border-gray-200">
                      {isPDF ? (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                          <DocumentIcon className="h-6 w-6 sm:h-10 sm:w-10 text-gray-400" />
                        </div>
                      ) : isBase64Image ? (
                        <div className="relative">
                          <Image
                            src={imageString}
                            alt={`Uploaded ${safeSubcategory?.name || 'image'} ${index + 1}`}
                            width={128}
                            height={128}
                            className="object-contain rounded-lg w-24 h-24 sm:w-32 sm:h-32"
                            unoptimized={true}
                            onError={() => {
                              console.log('Base64 image failed to load:', index);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                          <DocumentIcon className="h-6 w-6 sm:h-10 sm:w-10 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    {/* Remove Button - Mobile friendly touch target */}
                    <button
                      onClick={() => removeImage(activeCategory, activeSubcategory, index)}
                      disabled={isSubmitting}
                      className="absolute inset-0 w-full h-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed z-10 rounded-lg"
                    >
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-red-600 transition-colors">
                        <TrashIcon className="h-4 w-4 sm:h-6 sm:w-6" />
                      </div>
                    </button>
                    
                    {/* File Info - Mobile responsive filename */}
                    <div className="mt-1 text-center">
                      <p className="text-xs text-gray-600 truncate px-1 max-w-24 sm:max-w-32" title={`Image ${index + 1}`}>
                        Image {index + 1}
                      </p>
                    </div>
                  </div>
                );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

PropertyImageManager.displayName = 'PropertyImageManager';
