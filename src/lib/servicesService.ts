import { supabase } from './supabase';
import { Service, ServiceCreateData, ServiceUpdateData } from '@/types/Service';

/**
 * Service for managing services
 */
export class ServicesService {
  /**
   * Fetches all active services
   */
  static async getActiveServices(limit?: number): Promise<Service[]> {
    try {
      let query = supabase
        .from('services')
        .select(`
          *,
          service_images (
            id,
            service_id,
            image_path,
            alt_text,
            created_at
          )
        `)
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching services:', error);
        throw new Error(`Failed to fetch services: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getActiveServices:', error);
      throw error;
    }
  }

  /**
   * Fetches all services (admin function)
   */
  static async getAllServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_images (
            id,
            service_id,
            image_path,
            alt_text,
            created_at
          )
        `)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all services:', error);
        throw new Error(`Failed to fetch services: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllServices:', error);
      throw error;
    }
  }

  /**
   * Fetches a single service by ID
   */
  static async getServiceById(id: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_images (
            id,
            service_id,
            image_path,
            alt_text,
            created_at
          )
        `)
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
        throw new Error(`Failed to fetch service: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getServiceById:', error);
      throw error;
    }
  }

  /**
   * Fetches a single service by slug
   */
  static async getServiceBySlug(slug: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          service_images (
            id,
            service_id,
            image_path,
            alt_text,
            created_at
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .is('deleted_at', null)
        .single();

      if (error) {
        console.error('Error fetching service by slug:', error);
        throw new Error(`Failed to fetch service: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getServiceBySlug:', error);
      throw error;
    }
  }

  /**
   * Creates a new service
   */
  static async createService(serviceData: ServiceCreateData): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([serviceData])
        .select()
        .single();

      if (error) {
        console.error('Error creating service:', error);
        throw new Error(`Failed to create service: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in createService:', error);
      throw error;
    }
  }

  /**
   * Updates an existing service
   */
  static async updateService(id: string, serviceData: ServiceUpdateData): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service:', error);
        throw new Error(`Failed to update service: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in updateService:', error);
      throw error;
    }
  }

  /**
   * Soft deletes a service
   */
  static async deleteService(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('services')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error deleting service:', error);
        throw new Error(`Failed to delete service: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteService:', error);
      throw error;
    }
  }

  /**
   * Toggles the active status of a service
   */
  static async toggleServiceStatus(id: string, isActive: boolean): Promise<Service> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling service status:', error);
        throw new Error(`Failed to toggle service status: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in toggleServiceStatus:', error);
      throw error;
    }
  }

  /**
   * Gets the count of active services
   */
  static async getServicesCount(): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .is('deleted_at', null);

      if (error) {
        console.error('Error getting services count:', error);
        throw new Error(`Failed to get services count: ${error.message}`);
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getServicesCount:', error);
      throw error;
    }
  }
}
