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

export interface PropertyAmenities {
  basic_amenities?: BasicAmenities;
  luxury_amenities?: LuxuryAmenities;
  infrastructure?: InfrastructureAmenities;
  services?: ServiceAmenities;
  commercial_amenities?: CommercialAmenities;
  project_specific?: ProjectSpecificAmenities;
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
