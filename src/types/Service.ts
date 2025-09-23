export interface ServiceItem {
  id: string;
  service_name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  image_data?: string | null; // base64 data URL
  image_path?: string | null;
  image_alt?: string | null;
  is_active: boolean;
  sort_order: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateServiceItem {
  service_name: string;
  slug: string;
  short_description?: string | null;
  description?: string | null;
  image_data?: string | null; // base64 data URL
  image_path?: string | null;
  image_alt?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateServiceItem {
  service_name?: string;
  slug?: string;
  short_description?: string | null;
  description?: string | null;
  image_data?: string | null; // base64 data URL
  image_path?: string | null;
  image_alt?: string | null;
  is_active?: boolean;
  sort_order?: number;
}


