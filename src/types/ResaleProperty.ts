/**
 * TypeScript types for Resale Properties functionality
 */

export interface ResaleProperty {
  id: string;
  seller_name: string;
  submission_date?: string;
  seller_email: string;
  seller_contact_no: string;
  seller_alternate_no?: string;
  property_type: 'apartment' | 'gated_community_villa_or_bungalow' | 'independent_house';
  society_name?: string;
  bhk_type: '1_rk_1_bhk' | '2_bhk' | '3_bhk' | '4_bhk' | '5_bhk' | '5_plus_bhk';
  square_feet?: number;
  carpet_area?: number;
  location: string;
  floor_no?: string;
  facing?: string;
  parking_type?: 'covered_parking' | 'open_parking' | 'shed_parking';
  furnishing_type: 'fully_furnished' | 'semi_furnished' | 'un_furnished';
  asking_price: number;
  is_negotiable?: boolean;
  property_age?: string;
  has_amenities?: boolean;
  status?: string;
  documents?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  property_images?: {
    exterior?: string[];
    interior?: string[];
    kitchen?: string[];
    bathroom?: string[];
    bedroom?: string[];
    living_room?: string[];
    balcony?: string[];
    other?: string[];
  };
  amenities?: {
    swimming_pool?: boolean;
    gym?: boolean;
    club_house?: boolean;
    children_play_area?: boolean;
    jogging_track?: boolean;
    library?: boolean;
    indoor_games?: boolean;
    lift?: boolean;
    power_backup?: boolean;
    security?: boolean;
    park?: boolean;
    rainwater_harvesting?: boolean;
    sewage_treatment?: boolean;
    house_keeping?: boolean;
    fire_safety?: boolean;
    shopping_center?: boolean;
    gas_pipeline?: boolean;
    visitor_parking?: boolean;
  };
  general_photos?: {
    exterior?: string[];
    interior?: string[];
  };
  floor_plans?: {
    plans?: string[];
  };
  legal_docs?: {
    documents?: string[];
  };
  virtual_content?: {
    virtual_tour?: string[];
    videos?: string[];
  };
  ownership_type?: string;
  loan_on_property?: boolean;
  loan_amount?: number;
  bank_name?: string;
  reason_for_sale?: string;
  flats_per_floor?: string;
  society_area_size?: string;
  rera_id?: string;
  parking_vehicles?: {
    two_wheeler?: number;
    four_wheeler?: number;
  };
  visit_days_weekend?: string;
  visit_timing_weekend?: string;
  visit_days_weekdays?: string;
  visit_timing_weekdays?: string;
  listed_by?: 'owner' | 'agent';
  address_line?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  currency_code?: string;
  total_floors?: number;
  possession_status?: 'new_launch' | 'under_construction' | 'ready';
  possession_date?: string;
  available_from?: string;
  maintenance_charge?: number;
  maintenance_frequency?: 'monthly' | 'quarterly' | 'yearly';
  deleted_at?: string;
}

export interface ResalePropertyCreateData {
  seller_name: string;
  seller_email: string;
  seller_contact_no: string;
  seller_alternate_no?: string;
  property_type: 'apartment' | 'gated_community_villa_or_bungalow' | 'independent_house';
  society_name?: string;
  bhk_type: '1_rk_1_bhk' | '2_bhk' | '3_bhk' | '4_bhk' | '5_bhk' | '5_plus_bhk';
  square_feet?: number;
  carpet_area?: number;
  location: string;
  floor_no?: string;
  facing?: string;
  parking_type?: 'covered_parking' | 'open_parking' | 'shed_parking';
  furnishing_type: 'fully_furnished' | 'semi_furnished' | 'un_furnished';
  asking_price: number;
  is_negotiable?: boolean;
  property_age?: string;
  has_amenities?: boolean;
  status?: string;
  documents?: string[];
  notes?: string;
  created_by: string;
  property_images?: any;
  amenities?: any;
  general_photos?: any;
  floor_plans?: any;
  legal_docs?: any;
  virtual_content?: any;
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
  visit_timing_weekend?: string;
  visit_days_weekdays?: string;
  visit_timing_weekdays?: string;
  listed_by?: 'owner' | 'agent';
  address_line?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  currency_code?: string;
  total_floors?: number;
  possession_status?: 'new_launch' | 'under_construction' | 'ready';
  possession_date?: string;
  available_from?: string;
  maintenance_charge?: number;
  maintenance_frequency?: 'monthly' | 'quarterly' | 'yearly';
}
