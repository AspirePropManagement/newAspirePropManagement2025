/**
 * TypeScript types for Services functionality
 */

export interface ServiceImage {
  id: string;
  service_id: string;
  image_path: string;
  alt_text?: string;
  created_at: string;
}

export interface Service {
  id: string;
  service_name: string;
  short_description?: string;
  description?: string;
  image_path?: string;
  image_alt?: string;
  min_price?: number;
  max_price?: number;
  is_active: boolean;
  sort_order: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  image_data?: string;
  service_images?: ServiceImage[];
}

export interface ServiceCreateData {
  service_name: string;
  short_description?: string;
  description?: string;
  image_path?: string;
  image_alt?: string;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
  sort_order?: number;
  created_by?: string;
  image_data?: string;
}

export interface ServiceUpdateData {
  service_name?: string;
  short_description?: string;
  description?: string;
  image_path?: string;
  image_alt?: string;
  min_price?: number;
  max_price?: number;
  is_active?: boolean;
  sort_order?: number;
  image_data?: string;
}