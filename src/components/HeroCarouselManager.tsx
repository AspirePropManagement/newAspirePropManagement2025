'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useHeroCarousel } from '../hooks/useHeroCarousel';
import { CreateHeroCarouselImage } from '../types/HeroCarousel';
import { Plus, Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';
import { Toast } from './Toast';

/**
 * Component for managing hero carousel images
 * Allows admins to upload, view, and delete carousel images
 */
export const HeroCarouselManager: React.FC = () => {
  // Add custom styles for smooth scrolling and hidden scrollbar
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        scroll-behavior: smooth;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const {
    images,
    loading,
    error,
    createImage,
    deleteImage,
    toggleImageStatus,
    reorderImages,
    clearError
  } = useHeroCarousel();

  // Debug logging
  React.useEffect(() => {
    console.log('HeroCarouselManager - Current state:', {
      images: images?.length || 0,
      loading,
      error,
      hasImages: Array.isArray(images)
    });
  }, [images, loading, error]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
  const [togglingImageId, setTogglingImageId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  /**
   * Convert file size to human readable format
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Form state
  const [formData, setFormData] = useState<CreateHeroCarouselImage>({
    title: '',
    description: '',
    image_data: '',
    image_type: '',
    file_size: 0,
    display_order: 0,
    alt_text: ''
  });



  /**
   * Handle file selection and convert to base64
   */
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }



    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        image_data: result,
        image_type: file.type,
        file_size: file.size
      }));
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_data) {
      alert('Please select an image first.');
      return;
    }

    setIsUploading(true);
    
    try {
      // Set display order to be after the last image
      const nextOrder = images.length > 0 ? Math.max(...images.map(img => img.display_order)) + 1 : 0;
      await createImage({ ...formData, display_order: nextOrder });
      
      resetForm();
      setShowUploadForm(false);
      
      // Show success message
      setSuccessMessage('Image uploaded successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_data: '',
      image_type: '',
      file_size: 0,
      display_order: 0,
      alt_text: ''
    });
  };

  /**
   * Handle image deletion
   */
  const handleDelete = async (id: string) => {
    setImageToDelete(id);
    setDeleteModalOpen(true);
  };

  /**
   * Confirm and proceed with deletion
   */
  const confirmDelete = async () => {
    if (!imageToDelete) return;
    
    setDeletingImageId(imageToDelete);
    setDeleteModalOpen(false);
    
    try {
      await deleteImage(imageToDelete);
      setSuccessMessage('Image deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    } finally {
      setDeletingImageId(null);
      setImageToDelete(null);
    }
  };

  /**
   * Cancel deletion
   */
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setImageToDelete(null);
  };

  /**
   * Handle drag and drop reordering
   */
  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    setDragIndex(index);
  };

  const handleDragEnd = async () => {
    if (dragIndex !== null) {
      setIsReordering(true);
      try {
        // For now, just refresh the images to show current order
        // The actual reordering will be implemented when we have proper drag and drop
        await reorderImages(images.map(img => img.id));
        setSuccessMessage('Images refreshed successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error refreshing images:', error);
        alert('Failed to refresh images. Please try again.');
      } finally {
        setIsReordering(false);
        setDragIndex(null);
      }
    }
  };

  /**
   * Scroll carousel left
   */
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  /**
   * Scroll carousel right
   */
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Carousel Manager</h1>
          <p className="text-gray-600">Manage images for the landing page hero section</p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Image
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <Toast
          message={error}
          type="error"
          isVisible={true}
          onClose={clearError}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          isVisible={true}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Images Display - Horizontal Carousel */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Carousel Images ({images.length})
            </h3>
            {isReordering && (
              <div className="flex items-center text-sm text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Reordering...
              </div>
            )}
          </div>
        </div>

        {loading && images.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div>Loading images...</div>
          </div>
        ) : images.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No images uploaded yet. Click &quot;Add Image&quot; to get started.
          </div>
        ) : (
          <div className="p-6">
            <div className="relative">
              {/* Navigation Arrows */}
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                title="Scroll Left"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                title="Scroll Right"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div 
                ref={carouselRef}
                className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide px-12"
              >
                {images.map((image, index) => (
                  <div
                    key={image.id}
                                         className={`relative bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-4 transition-all flex-shrink-0 w-80 ${
                       dragIndex === index ? 'border-blue-400 bg-blue-50' : ''
                     }`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Drag Handle */}
                    <div className="absolute top-2 right-2 cursor-move text-gray-400 hover:text-gray-600">
                      {isReordering ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      ) : (
                        <GripVertical className="w-4 h-4" />
                      )}
                    </div>

                    {/* Image Preview */}
                    <div className="mb-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden">
                        <Image
                          src={image.image_data}
                          alt={image.alt_text || image.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {/* Image Info */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 truncate">{image.title}</h4>
                      {image.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{image.description}</p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Order: {image.display_order}</span>
                        <span>{image.file_size ? formatFileSize(image.file_size) : 'N/A'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        onClick={async () => {
                          setTogglingImageId(image.id);
                          try {
                            await toggleImageStatus(image.id, !image.is_active);
                          } catch (error) {
                            console.error('Error toggling image status:', error);
                            alert('Failed to toggle image status. Please try again.');
                          } finally {
                            setTogglingImageId(null);
                          }
                        }}
                        disabled={togglingImageId === image.id}
                        className={`flex items-center px-2 py-1 rounded text-xs disabled:opacity-50 ${
                          image.is_active
                            ? 'text-green-600 bg-green-100 hover:bg-green-200'
                            : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {togglingImageId === image.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                        ) : (
                          image.is_active ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />
                        )}
                        {image.is_active ? 'Active' : 'Inactive'}
                      </button>

                      <button
                        onClick={() => handleDelete(image.id)}
                        disabled={deletingImageId === image.id}
                        className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingImageId === image.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>



      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Upload New Image
              </h2>
              <button
                onClick={() => {
                  setShowUploadForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image title"
                  />
                </div>

                               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">
                   Display Order
                 </label>
                 <input
                   type="number"
                   value={images.length > 0 ? Math.max(...images.map(img => img.display_order)) + 1 : 0}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                   disabled
                   readOnly
                 />
                 <p className="mt-1 text-xs text-gray-500">
                   Auto-calculated based on existing images
                 </p>
               </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter image description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter alt text for accessibility"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image *
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Select any image file (JPEG, PNG, WebP, etc.) - No size restrictions
                </p>
                {formData.image_data && (
                  <div className="mt-2">
                    <div className="relative w-32 h-24 rounded border overflow-hidden">
                      <Image
                        src={formData.image_data}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      File size: {formData.file_size ? formatFileSize(formData.file_size) : 'N/A'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isUploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    'Upload Image'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && imageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete image &quot;{images.find(img => img.id === imageToDelete)?.title}&quot;?
              <br />
              <span className="text-sm text-gray-500">This action cannot be undone.</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
