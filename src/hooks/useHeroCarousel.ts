import { useState, useEffect, useCallback } from 'react';
import { HeroCarouselImage, CreateHeroCarouselImage, UpdateHeroCarouselImage } from '../types/HeroCarousel';
import { HeroCarouselService } from '../lib/heroCarouselService';

/**
 * Custom hook for managing hero carousel images
 */
export const useHeroCarousel = () => {
  const [images, setImages] = useState<HeroCarouselImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all hero carousel images
   */
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await HeroCarouselService.getAllImages();
      setImages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new hero carousel image
   */
  const createImage = useCallback(async (imageData: CreateHeroCarouselImage) => {
    try {
      setError(null);
      const newImage = await HeroCarouselService.createImage(imageData);
      setImages(prev => [...prev, newImage]);
      return newImage;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create image';
      setError(errorMessage);
      console.error('Error creating image:', err);
      throw err;
    }
  }, []);

  /**
   * Update an existing hero carousel image
   */
  const updateImage = useCallback(async (id: string, updates: UpdateHeroCarouselImage) => {
    try {
      setError(null);
      const updatedImage = await HeroCarouselService.updateImage(id, updates);
      setImages(prev => prev.map(img => img.id === id ? updatedImage : img));
      return updatedImage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
      throw err;
    }
  }, []);

  /**
   * Delete a hero carousel image
   */
  const deleteImage = useCallback(async (id: string) => {
    try {
      setError(null);
      await HeroCarouselService.deleteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      throw err;
    }
  }, []);

  /**
   * Toggle the active status of an image
   */
  const toggleImageStatus = useCallback(async (id: string, isActive: boolean) => {
    try {
      setError(null);
      const updatedImage = await HeroCarouselService.toggleImageStatus(id, isActive);
      setImages(prev => prev.map(img => img.id === id ? updatedImage : img));
      return updatedImage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle image status');
      throw err;
    }
  }, []);

  /**
   * Reorder images by updating their display order
   */
  const reorderImages = useCallback(async (orderedIds: string[]) => {
    try {
      setError(null);
      await HeroCarouselService.reorderImages(orderedIds);
      // Refresh images to get updated order
      await fetchImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder images');
      throw err;
    }
  }, [fetchImages]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch images on mount
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return {
    images,
    loading,
    error,
    fetchImages,
    createImage,
    updateImage,
    deleteImage,
    toggleImageStatus,
    reorderImages,
    clearError
  };
};
