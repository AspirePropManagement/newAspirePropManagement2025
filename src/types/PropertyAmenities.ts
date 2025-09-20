// Property Amenities TypeScript Interfaces
// This defines the structure for the amenities JSONB column

export interface BasicAmenities {
  power_backup?: boolean;
  lift?: boolean;
  security?: boolean;
  visitor_parking?: boolean;
  fire_safety?: boolean;
}

export interface LuxuryAmenities {
  club_house?: boolean;
  swimming_pool?: boolean;
  children_play_area?: boolean;
  gym?: boolean;
  park?: boolean;
  spa?: boolean;
  sauna?: boolean;
  jacuzzi?: boolean;
  party_hall?: boolean;
  banquet_hall?: boolean;
}

export interface InfrastructureAmenities {
  gas_pipeline?: boolean;
  rain_water_harvesting?: boolean;
  sewage_treatment_plant?: boolean;
  solar_panels?: boolean;
  water_treatment_plant?: boolean;
  waste_management?: boolean;
  broadband?: boolean;
  cctv_surveillance?: boolean;
}

export interface ServiceAmenities {
  house_keeping?: boolean;
  maintenance_service?: boolean;
  laundry_service?: boolean;
  dry_cleaning?: boolean;
  grocery_delivery?: boolean;
  food_delivery?: boolean;
  car_wash?: boolean;
  pet_care?: boolean;
}

export interface CommercialAmenities {
  conference_rooms?: boolean;
  business_center?: boolean;
  meeting_rooms?: boolean;
  reception_area?: boolean;
  waiting_lounge?: boolean;
  cafeteria?: boolean;
  vending_machines?: boolean;
  atm?: boolean;
  banking_facilities?: boolean;
}

export interface ProjectSpecificAmenities {
  is_govt_approved?: boolean;
  is_rera_approved?: boolean;
  loan_available?: boolean;
  social_media_marketing_allowed?: boolean;
  emi_facility?: boolean;
  booking_amount?: boolean;
  possession_available?: boolean;
  ready_to_move?: boolean;
}

export interface FurnitureAmenities {
  // Living Room Furniture
  sofa_set?: boolean;
  coffee_table?: boolean;
  tv_unit?: boolean;
  bookshelf?: boolean;
  center_table?: boolean;
  side_tables?: boolean;
  recliner_chair?: boolean;
  
  // Bedroom Furniture
  bed_with_mattress?: boolean;
  wardrobe?: boolean;
  dressing_table?: boolean;
  study_table?: boolean;
  bedside_tables?: boolean;
  chest_of_drawers?: boolean;
  
  // Dining Room Furniture
  dining_table?: boolean;
  dining_chairs?: boolean;
  sideboard?: boolean;
  bar_cabinet?: boolean;
  
  // Kitchen Furniture & Appliances
  modular_kitchen?: boolean;
  refrigerator?: boolean;
  washing_machine?: boolean;
  microwave?: boolean;
  gas_stove?: boolean;
  water_purifier?: boolean;
  mixer_grinder?: boolean;
  toaster?: boolean;
  dishwasher?: boolean;
  
  // Additional Furniture
  office_desk?: boolean;
  computer_chair?: boolean;
  shoe_rack?: boolean;
  mirror?: boolean;
  curtains?: boolean;
  carpet?: boolean;
  air_conditioner?: boolean;
  ceiling_fan?: boolean;
  table_fan?: boolean;
  geyser?: boolean;
  water_heater?: boolean;
}

export interface NearbyFacilities {
  // Healthcare
  hospital?: boolean;
  clinic?: boolean;
  pharmacy?: boolean;
  diagnostic_center?: boolean;
  dental_clinic?: boolean;
  
  // Education
  school?: boolean;
  college?: boolean;
  university?: boolean;
  coaching_center?: boolean;
  library?: boolean;
  play_school?: boolean;
  
  // Transportation
  metro_station?: boolean;
  bus_stop?: boolean;
  railway_station?: boolean;
  airport?: boolean;
  taxi_stand?: boolean;
  auto_rickshaw_stand?: boolean;
  
  // Shopping & Entertainment
  shopping_mall?: boolean;
  supermarket?: boolean;
  local_market?: boolean;
  cinema_hall?: boolean;
  multiplex?: boolean;
  restaurant?: boolean;
  cafe?: boolean;
  food_court?: boolean;
  
  // Banking & Finance
  bank?: boolean;
  atm?: boolean;
  post_office?: boolean;
  insurance_office?: boolean;
  
  // Recreation & Sports
  park?: boolean;
  gym?: boolean;
  swimming_pool?: boolean;
  sports_club?: boolean;
  community_hall?: boolean;
  
  // Essential Services
  police_station?: boolean;
  fire_station?: boolean;
  petrol_pump?: boolean;
  service_center?: boolean;
  laundry?: boolean;
  dry_cleaning?: boolean;
  
  // Religious Places
  temple?: boolean;
  mosque?: boolean;
  church?: boolean;
  gurudwara?: boolean;
  
  // Other
  beauty_parlor?: boolean;
  salon?: boolean;
  spa?: boolean;
  pet_clinic?: boolean;
  veterinary_hospital?: boolean;
}

export interface PropertyAmenities {
  basic_amenities?: BasicAmenities;
  luxury_amenities?: LuxuryAmenities;
  infrastructure?: InfrastructureAmenities;
  services?: ServiceAmenities;
  commercial_amenities?: CommercialAmenities;
  project_specific?: ProjectSpecificAmenities;
  furniture_amenities?: FurnitureAmenities;
  nearby_facilities?: NearbyFacilities;
  custom_amenities?: Record<string, boolean | string | number>;
}

// Utility type for checking if amenities exist
export type AmenityCategory = keyof PropertyAmenities;

// Utility function to check if a specific amenity exists
export function hasAmenity(
  amenities: PropertyAmenities | null | undefined,
  category: AmenityCategory,
  amenityName: string
): boolean {
  if (!amenities || !amenities[category]) {
    return false;
  }
  
  const categoryAmenities = amenities[category] as Record<string, any>;
  return categoryAmenities[amenityName] === true;
}

// Utility function to get all amenities as a flat list
export function getAllAmenities(amenities: PropertyAmenities | null | undefined): string[] {
  if (!amenities) return [];
  
  const allAmenities: string[] = [];
  
  Object.entries(amenities).forEach(([category, categoryAmenities]) => {
    if (categoryAmenities && typeof categoryAmenities === 'object') {
      Object.entries(categoryAmenities).forEach(([amenityName, value]) => {
        if (value === true) {
          allAmenities.push(`${category}.${amenityName}`);
        }
      });
    }
  });
  
  return allAmenities;
}

// Utility function to count total amenities
export function countAmenities(amenities: PropertyAmenities | null | undefined): number {
  if (!amenities) return 0;
  
  let count = 0;
  Object.values(amenities).forEach(category => {
    if (category && typeof category === 'object') {
      Object.values(category).forEach(value => {
        if (value === true) count++;
      });
    }
  });
  
  return count;
}

// Example usage:
// const amenities: PropertyAmenities = {
//   basic_amenities: {
//     power_backup: true,
//     lift: true,
//     security: true
//   },
//   luxury_amenities: {
//     club_house: true,
//     swimming_pool: true
//   }
// };
// 
// const hasPowerBackup = hasAmenity(amenities, 'basic_amenities', 'power_backup'); // true
// const totalAmenities = countAmenities(amenities); // 5
// const allAmenitiesList = getAllAmenities(amenities); // ['basic_amenities.power_backup', 'basic_amenities.lift', ...]
