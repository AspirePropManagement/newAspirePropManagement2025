import { supabase } from './supabase';
import { ServiceItem, CreateServiceItem, UpdateServiceItem } from '@/types/Service';

/**
 * Service for managing Services (admin CRUD and public fetch)
 */
export class ServicesService {
  /** Get all services (admin view), ordered */
  static async getAll(): Promise<ServiceItem[]> {
    if (!supabase) throw new Error('Database connection not available');
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  /** Get active services for public website */
  static async getActive(): Promise<ServiceItem[]> {
    if (!supabase) throw new Error('Database connection not available');
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  /** Create a new service */
  static async create(payload: CreateServiceItem): Promise<ServiceItem> {
    if (!supabase) throw new Error('Database connection not available');
    const { data, error } = await supabase
      .from('services')
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as ServiceItem;
  }

  /** Update a service by id */
  static async update(id: string, updates: UpdateServiceItem): Promise<ServiceItem> {
    if (!supabase) throw new Error('Database connection not available');
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as ServiceItem;
  }

  /** Delete a service by id */
  static async remove(id: string): Promise<void> {
    if (!supabase) throw new Error('Database connection not available');
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}


