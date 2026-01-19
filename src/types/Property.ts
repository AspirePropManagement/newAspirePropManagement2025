/**
 * Image source type that can be either a URL or base64 data
 * Supports both external URLs and embedded base64 images
 */
export type ImageSource = string;

/**
 * Property entity representing a real estate property
 * Implements the Single Responsibility Principle by only defining property data structure
 * Now supports both URL and base64 image formats
 */
export interface PropertyImages {
  // General Property Photos
  general_photos?: {
    exterior?: ImageSource[];
    interior?: ImageSource[];
    bedrooms?: ImageSource[];
    kitchen?: ImageSource[];
    bathrooms?: ImageSource[];
    living_dining_balcony?: ImageSource[];
    amenities?: ImageSource[];
  };
  
  // Floor Plans and Layouts
  floor_plans?: {
    floor_plan?: ImageSource[];
    site_plan?: ImageSource[];
    master_plan?: ImageSource[];
    blueprint?: ImageSource[];
    elevation?: ImageSource[];
    layout_2d?: ImageSource[];
    layout_3d?: ImageSource[];
  };
  
  // Project Specific Images (for New Projects)
  project_images?: {
    club_house?: ImageSource[];
    swimming_pool?: ImageSource[];
    gym?: ImageSource[];
    children_play_area?: ImageSource[];
    park?: ImageSource[];
    security_gate?: ImageSource[];
    reception_lounge?: ImageSource[];
    banquet_hall?: ImageSource[];
    retail_area?: ImageSource[];
    parking_area?: ImageSource[];
  };
  
  // Legal and Documentation
  legal_docs?: {
    rera_certificate?: ImageSource[];
    approval_documents?: ImageSource[];
    legal_documents?: ImageSource[];
    brochures?: ImageSource[];
  };
  
  // Virtual Tours and Videos
  virtual_content?: {
    virtual_tour?: ImageSource[];
    video_walkthrough?: ImageSource[];
    drone_footage?: ImageSource[];
    promotional_videos?: ImageSource[];
  };
}

export interface ResaleProperty {
  id: string;
  seller_name: string;
  submission_date: string;
  seller_email: string;
  seller_contact_no: string;
  seller_alternate_no?: string;
  property_type: 'apartment' | 'gated_community_villa_or_bungalow' | 'independent_house';
  society_name?: string;
  bhk_type: '1_rk' | '2_bhk' | '3_bhk' | '4_bhk' | '5_bhk' | '5_plus_bhk';
  square_feet?: number;
  carpet_area?: number;
  location: string;
  floor_no?: string;
  facing?: string;
  furnishing_type: 'fully_furnished' | 'semi_furnished' | 'un_furnished';
  asking_price: number;
  is_negotiable?: boolean;
  property_age?: string;
  has_amenities?: boolean;
  status?: string;
  property_images?: PropertyImages;
  amenities?: any;
  general_photos?: any;
  floor_plans?: any;
  legal_docs?: any;
  virtual_content?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  // New fields
  ownership_type?: string;
  loan_on_property?: boolean;
  loan_amount?: number;
  bank_name?: string;
  reason_for_sale?: string;
  flats_per_floor?: string;
  society_area_size?: string;
  rera_id?: string;
  parking_vehicles?: any;
  visit_days_weekend?: string;
  visit_timing_weekend_from?: string;
  visit_timing_weekend_to?: string;
  visit_days_weekdays?: string;
  visit_timing_weekdays_from?: string;
  visit_timing_weekdays_to?: string;
  listed_by?: 'owner' | 'agent';
}

export interface RentalProperty {
  id: string;
  owner_name: string;
  submission_date: string;
  owner_email: string;
  owner_contact_no: string;
  owner_alternate_no?: string;
  property_type: 'apartment' | 'gated_community_villa_or_bungalow' | 'independent_house';
  society_name?: string;
  bhk_type: '1_rk' | '2_bhk' | '3_bhk' | '4_bhk' | '5_bhk' | '5_plus_bhk';
  location: string;
  floor_no?: string;
  rent_amount: number;
  rent_negotiable?: boolean;
  deposit_amount?: number;
  deposit_negotiable?: boolean;
  pets_allowed?: boolean;
  furnishing_type: 'fully_furnished' | 'semi_furnished' | 'un_furnished';
  immediate_possession?: boolean;
  available_from_date?: string;
  visit_details?: string;
  has_amenities?: boolean;
  status?: string;
  property_images?: PropertyImages;
  amenities?: any;
  general_photos?: any;
  floor_plans?: any;
  legal_docs?: any;
  virtual_content?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  // New fields
  tenant_type?: 'family' | 'bachelor' | 'anyone';
  parking_vehicles?: any;
  visit_days_weekend?: string;
  visit_timing_weekend_from?: string;
  visit_timing_weekend_to?: string;
  visit_days_weekdays?: string;
  visit_timing_weekdays_from?: string;
  visit_timing_weekdays_to?: string;
  listed_by?: 'owner' | 'agent';
}

export interface NewProject {
  id: string;
  crafted_by: string;
  project_name: string;
  project_type: 'residence' | 'gated_community_villa_or_bungalow' | 'commercial' | 'land_or_plot';
  construction_type: 'new_launching' | 'under_construction' | 'ready_to_move' | 'partial_ready_to_move';
  project_location: string;
  open_space?: number;
  cp_sables?: string;
  project_description?: string;
  is_govt_approved?: boolean;
  is_rera_approved?: boolean;
  loan_available?: boolean;
  social_media_marketing_allowed?: boolean;
  important_notes?: string;
  units_available_for_sale?: string;
  rera_number?: string;
  project_conversion_rate?: string;
  club_house?: boolean;
  swimming_pool?: boolean;
  children_play_area?: boolean;
  power_backup?: boolean;
  house_keeping?: boolean;
  lift?: boolean;
  gym?: boolean;
  park?: boolean;
  security?: boolean;
  gas_pipeline?: boolean;
  rain_water_harvesting?: boolean;
  sewage_treatment_plant?: boolean;
  visitor_parking?: boolean;
  fire_safety?: boolean;
  status?: string;
  documents?: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  property_images?: PropertyImages;
  amenities?: any;
  general_photos?: any;
  floor_plans?: any;
  project_images?: any;
  legal_docs?: any;
  virtual_content?: any;
  total_project_area_size?: string;
  towers_count?: number;
  total_floors?: number;
  puggestion_date?: string;
  flats_per_floor?: string;
  roi?: string;
  rental_yield?: number;
  marketed_by?: string;
  listed_by?: 'builder' | 'agent';
  facing_vastu?: string;
  latitude?: number;
  longitude?: number;
  launch_date?: string;
  possession_date?: string;
  min_price?: number;
  currency_code?: string;
  website_url?: string;
  brochure_url?: string;
  deleted_at?: string;
}

export type Property = ResaleProperty | RentalProperty | NewProject;
