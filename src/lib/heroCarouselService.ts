import { supabase } from './supabase';
import { HeroCarouselImage, CreateHeroCarouselImage, UpdateHeroCarouselImage } from '../types/HeroCarousel';

/**
 * Service for managing hero carousel images
 */
export class HeroCarouselService {
  /**
   * Get all hero carousel images ordered by display order
   */
  static async getAllImages(): Promise<HeroCarouselImage[]> {
    try {
      const { data, error } = await supabase
        .from('hero_carousel_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching hero carousel images:', error);
      throw error;
    }
  }

  /**
   * Get active hero carousel images for public display
   */
  static async getActiveImages(): Promise<HeroCarouselImage[]> {
    try {
      const { data, error } = await supabase
        .from('hero_carousel_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching active hero carousel images:', error);
      throw error;
    }
  }

  /**
   * Create a new hero carousel image
   */
  static async createImage(imageData: CreateHeroCarouselImage): Promise<HeroCarouselImage> {
    try {
      // Add timeout to prevent statement timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout - image too large')), 30000); // 30 seconds
      });

      const uploadPromise = supabase
        .from('hero_carousel_images')
        .insert([imageData])
        .select()
        .single();

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating hero carousel image:', error);
      throw error;
    }
  }

  /**
   * Update an existing hero carousel image
   */
  static async updateImage(id: string, updates: UpdateHeroCarouselImage): Promise<HeroCarouselImage> {
    try {
      const { data, error } = await supabase
        .from('hero_carousel_images')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating hero carousel image:', error);
      throw error;
    }
  }

  /**
   * Delete a hero carousel image
   */
  static async deleteImage(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('hero_carousel_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting hero carousel image:', error);
      throw error;
    }
  }

  /**
   * Toggle the active status of an image
   */
  static async toggleImageStatus(id: string, isActive: boolean): Promise<HeroCarouselImage> {
    try {
      const { data, error } = await supabase
        .from('hero_carousel_images')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling image status:', error);
      throw error;
    }
  }

  /**
   * Reorder images by updating their display order
   */
  static async reorderImages(orderedIds: string[]): Promise<void> {
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index
      }));

      const { error } = await supabase
        .from('hero_carousel_images')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
    } catch (error) {
      console.error('Error reordering images:', error);
      throw error;
    }
  }
}
