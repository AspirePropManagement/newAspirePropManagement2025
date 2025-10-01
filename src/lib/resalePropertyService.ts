import { supabase } from './supabase';
import { ResaleProperty, ResalePropertyCreateData } from '@/types/ResaleProperty';

/**
 * Service for managing resale properties
 */
export class ResalePropertyService {
  /**
   * Fetches all active resale properties
   */
  static async getActiveResaleProperties(limit?: number): Promise<ResaleProperty[]> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      let query = supabase
        .from('resale_properties')
        .select('*')
        .eq('status', 'available')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching resale properties:', error);
        throw new Error(`Failed to fetch resale properties: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveResaleProperties:', error);
      throw error;
    }
  }

  /**
   * Fetches a single resale property by ID
   */
  static async getResalePropertyById(id: string): Promise<ResaleProperty | null> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { data, error } = await supabase
        .from('resale_properties')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        console.error('Error fetching resale property:', error);
        throw new Error(`Failed to fetch resale property: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getResalePropertyById:', error);
      throw error;
    }
  }

  /**
   * Fetches resale properties by location
   */
  static async getResalePropertiesByLocation(location: string, limit?: number): Promise<ResaleProperty[]> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      let query = supabase
        .from('resale_properties')
        .select('*')
        .eq('status', 'available')
        .is('deleted_at', null)
        .ilike('location', `%${location}%`)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching resale properties by location:', error);
        throw new Error(`Failed to fetch resale properties: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getResalePropertiesByLocation:', error);
      throw error;
    }
  }

  /**
   * Creates a new resale property
   */
  static async createResaleProperty(propertyData: ResalePropertyCreateData): Promise<ResaleProperty> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { data, error } = await supabase
        .from('resale_properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Error creating resale property:', error);
        throw new Error(`Failed to create resale property: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createResaleProperty:', error);
      throw error;
    }
  }

  /**
   * Updates an existing resale property
   */
  static async updateResaleProperty(id: string, propertyData: Partial<ResalePropertyCreateData>): Promise<ResaleProperty> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { data, error } = await supabase
        .from('resale_properties')
        .update(propertyData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating resale property:', error);
        throw new Error(`Failed to update resale property: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateResaleProperty:', error);
      throw error;
    }
  }

  /**
   * Soft deletes a resale property
   */
  static async deleteResaleProperty(id: string): Promise<void> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { error } = await supabase
        .from('resale_properties')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error deleting resale property:', error);
        throw new Error(`Failed to delete resale property: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteResaleProperty:', error);
      throw error;
    }
  }

  /**
   * Gets the count of active resale properties
   */
  static async getResalePropertiesCount(): Promise<number> {
    try {
      if (!supabase) {
        throw new Error('Database connection not available');
      }
      
      const { count, error } = await supabase
        .from('resale_properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available')
        .is('deleted_at', null);

      if (error) {
        console.error('Error getting resale properties count:', error);
        throw new Error(`Failed to get resale properties count: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getResalePropertiesCount:', error);
      throw error;
    }
  }
}
