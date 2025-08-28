export interface HeroCarouselImage {
  id: string;
  title: string;
  description?: string;
  image_data: string;
  image_type: string;
  file_size?: number;
  display_order: number;
  is_active: boolean;
  alt_text?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CreateHeroCarouselImage {
  title: string;
  description?: string;
  image_data: string;
  image_type: string;
  file_size?: number;
  display_order: number;
  alt_text?: string;
}

export interface UpdateHeroCarouselImage {
  title?: string;
  description?: string;
  image_data?: string;
  image_type?: string;
  file_size?: number;
  display_order?: number;
  is_active?: boolean;
  alt_text?: string;
}
