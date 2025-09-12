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
    living_dining?: ImageSource[];
    balcony?: ImageSource[];
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
  bhk_type: '1_rk_1_bhk' | '2_bhk' | '3_bhk' | '4_bhk' | '5_bhk' | '5_plus_bhk';
  square_feet?: number;
  carpet_area?: number;
  location: string;
  flat_no?: string;
  wing_no?: string;
  floor_no?: string;
  facing?: string;
  parking_type?: 'covered_parking' | 'open_parking' | 'shed_parking';
  furnishing_type: 'fully_furnished' | 'semi_furnished' | 'un_furnished';
  asking_price: number;
  is_negotiable?: boolean;
  property_age?: string;
  has_amenities?: boolean;
  status?: string;
  property_images?: PropertyImages;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
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
  bhk_type: '1_rk_1_bhk' | '2_bhk' | '3_bhk' | '4_bhk' | '5_bhk' | '5_plus_bhk';
  location: string;
  flat_no?: string;
  wing_no?: string;
  floor_no?: string;
  rent_amount: number;
  rent_negotiable?: boolean;
  deposit_amount?: number;
  deposit_negotiable?: boolean;
  allowed_for_family?: boolean;
  allowed_for_bachelor?: boolean;
  allowed_for_anyone?: boolean;
  pets_allowed?: boolean;
  parking_type?: 'covered_parking' | 'open_parking' | 'shed_parking';
  furnishing_type: 'fully_furnished' | 'semi_furnished' | 'un_furnished';
  immediate_possession?: boolean;
  available_from_date?: string;
  visit_details?: string;
  has_amenities?: boolean;
  status?: string;
  property_images?: PropertyImages;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface NewProject {
  id: string;
  project_name: string;
  developer_name: string;
  submission_date: string;
  developer_email: string;
  developer_contact_no: string;
  developer_alternate_no?: string;
  property_type: 'apartment' | 'gated_community_villa_or_bungalow' | 'independent_house';
  location: string;
  total_units?: number;
  available_units?: number;
  starting_price?: number;
  price_range?: string;
  possession_date?: string;
  rera_number?: string;
  project_status: 'planning' | 'under_construction' | 'ready_to_move' | 'completed';
  amenities?: string[];
  property_images?: PropertyImages;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export type Property = ResaleProperty | RentalProperty | NewProject;
