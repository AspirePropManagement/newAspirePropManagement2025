/**
 * TypeScript types for Ads Banner functionality
 */

export type BannerLocation = 'home_top' | 'home_middle' | 'home_bottom' | 'properties_top' | 'properties_bottom';

export interface AdsBanner {
  id: string;
  title: string;
  image_base64: string;
  image_mime: string;
  link_url?: string;
  alt_text?: string;
  display_location: BannerLocation;
  sort_order: number;
  start_at?: string;
  end_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdsBannerCreateData {
  title: string;
  image_base64: string;
  image_mime: string;
  link_url?: string;
  alt_text?: string;
  display_location: BannerLocation;
  sort_order?: number;
  start_at?: string;
  end_at?: string;
  is_active?: boolean;
}

export interface AdsBannerUpdateData {
  title?: string;
  image_base64?: string;
  image_mime?: string;
  link_url?: string;
  alt_text?: string;
  display_location?: BannerLocation;
  sort_order?: number;
  start_at?: string;
  end_at?: string;
  is_active?: boolean;
}
