import { supabase } from './supabase';
import { AdsBanner, AdsBannerCreateData, AdsBannerUpdateData, BannerLocation } from '@/types/AdsBanner';

/**
 * Service for managing ads banners
 */
export class AdsBannerService {
  /**
   * Fetches active ads banners for a specific location
   */
  static async getActiveBannersByLocation(location: BannerLocation): Promise<AdsBanner[]> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      // Fetch all active banners (same as admin panel - no location filter for now)
      // This will show banners regardless of display_location
      // TODO: If you want to filter by location, uncomment the .eq('display_location', location) line
      const { data, error } = await supabase
        .from('ads_banners')
        .select('*')
        // .eq('display_location', location)  // Temporarily disabled to show all active banners
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching ads banners:', error);
        throw new Error(`Failed to fetch ads banners: ${error.message}`);
      }

      const banners = (data || []) as AdsBanner[];

      console.log('Fetched banners for location:', {
        location,
        count: banners.length,
        banners: banners.map(b => ({ 
          id: b.id, 
          title: b.title, 
          is_active: b.is_active, 
          display_location: b.display_location
        }))
      });

      return banners;
    } catch (error) {
      console.error('Error in getActiveBannersByLocation:', error);
      throw error;
    }
  }

  /**
   * Fetches all ads banners (admin function)
   */
  static async getAllBanners(): Promise<AdsBanner[]> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { data, error } = await supabase
        .from('ads_banners')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all ads banners:', error);
        throw new Error(`Failed to fetch ads banners: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllBanners:', error);
      throw error;
    }
  }

  /**
   * Creates a new ads banner
   */
  static async createBanner(bannerData: AdsBannerCreateData): Promise<AdsBanner> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { data, error } = await supabase
        .from('ads_banners')
        .insert([bannerData])
        .select()
        .single();

      if (error) {
        console.error('Error creating ads banner:', error);
        throw new Error(`Failed to create ads banner: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createBanner:', error);
      throw error;
    }
  }

  /**
   * Updates an existing ads banner
   */
  static async updateBanner(id: string, bannerData: AdsBannerUpdateData): Promise<AdsBanner> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { data, error } = await supabase
        .from('ads_banners')
        .update(bannerData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating ads banner:', error);
        throw new Error(`Failed to update ads banner: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateBanner:', error);
      throw error;
    }
  }

  /**
   * Deletes an ads banner
   */
  static async deleteBanner(id: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('ads_banners')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting ads banner:', error);
        throw new Error(`Failed to delete ads banner: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteBanner:', error);
      throw error;
    }
  }

  /**
   * Toggles the active status of an ads banner
   */
  static async toggleBannerStatus(id: string, isActive: boolean): Promise<AdsBanner> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { data, error } = await supabase
        .from('ads_banners')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling ads banner status:', error);
        throw new Error(`Failed to toggle ads banner status: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in toggleBannerStatus:', error);
      throw error;
    }
  }
}
