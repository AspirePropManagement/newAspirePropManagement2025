'use client';

import React, { useState, useEffect } from 'react';
import { PropertyAmenities } from '@/types/PropertyAmenities';

interface PropertyAmenitiesManagerProps {
  initialAmenities?: PropertyAmenities;
  onAmenitiesChange: (amenities: PropertyAmenities) => void;
}

const AMENITY_CATEGORIES = {
  basic_amenities: {
    title: 'Basic Amenities',
    icon: '🏠',
    items: {
      power_backup: 'Power Backup',
      lift: 'Lift/Elevator',
      security: 'Security',
      visitor_parking: 'Visitor Parking',
      fire_safety: 'Fire Safety'
    }
  },
  luxury_amenities: {
    title: 'Luxury Amenities',
    icon: '⭐',
    items: {
      club_house: 'Club House',
      swimming_pool: 'Swimming Pool',
      children_play_area: 'Children Play Area',
      gym: 'Gym/Fitness Center',
      park: 'Park/Garden',
      spa: 'Spa',
      sauna: 'Sauna',
      jacuzzi: 'Jacuzzi',
      party_hall: 'Party Hall',
      banquet_hall: 'Banquet Hall'
    }
  },
  infrastructure: {
    title: 'Infrastructure',
    icon: '🏗️',
    items: {
      gas_pipeline: 'Gas Pipeline',
      rain_water_harvesting: 'Rain Water Harvesting',
      sewage_treatment_plant: 'Sewage Treatment Plant',
      solar_panels: 'Solar Panels',
      water_treatment_plant: 'Water Treatment Plant',
      waste_management: 'Waste Management',
      broadband: 'Broadband/Internet',
      cctv_surveillance: 'CCTV Surveillance'
    }
  },
  services: {
    title: 'Services',
    icon: '🛠️',
    items: {
      house_keeping: 'House Keeping',
      maintenance_service: 'Maintenance Service',
      laundry_service: 'Laundry Service',
      dry_cleaning: 'Dry Cleaning',
      grocery_delivery: 'Grocery Delivery',
      food_delivery: 'Food Delivery',
      car_wash: 'Car Wash',
      pet_care: 'Pet Care'
    }
  },
  commercial_amenities: {
    title: 'Commercial Amenities',
    icon: '🏢',
    items: {
      conference_rooms: 'Conference Rooms',
      business_center: 'Business Center',
      meeting_rooms: 'Meeting Rooms',
      reception_area: 'Reception Area',
      waiting_lounge: 'Waiting Lounge',
      cafeteria: 'Cafeteria',
      vending_machines: 'Vending Machines',
      atm: 'ATM',
      banking_facilities: 'Banking Facilities'
    }
  },
  project_specific: {
    title: 'Project Specific',
    icon: '📋',
    items: {
      is_govt_approved: 'Government Approved',
      is_rera_approved: 'RERA Approved',
      loan_available: 'Loan Available',
      social_media_marketing_allowed: 'Social Media Marketing Allowed',
      emi_facility: 'EMI Facility',
      booking_amount: 'Booking Amount Required',
      possession_available: 'Possession Available',
      ready_to_move: 'Ready to Move'
    }
  },
  furniture_amenities: {
    title: 'Furniture & Appliances',
    icon: '🪑',
    items: {
      // Living Room
      sofa_set: 'Sofa Set',
      coffee_table: 'Coffee Table',
      tv_unit: 'TV Unit',
      bookshelf: 'Bookshelf',
      center_table: 'Center Table',
      side_tables: 'Side Tables',
      recliner_chair: 'Recliner Chair',
      
      // Bedroom
      bed_with_mattress: 'Bed with Mattress',
      wardrobe: 'Wardrobe',
      dressing_table: 'Dressing Table',
      study_table: 'Study Table',
      bedside_tables: 'Bedside Tables',
      chest_of_drawers: 'Chest of Drawers',
      
      // Dining Room
      dining_table: 'Dining Table',
      dining_chairs: 'Dining Chairs',
      sideboard: 'Sideboard',
      bar_cabinet: 'Bar Cabinet',
      
      // Kitchen & Appliances
      modular_kitchen: 'Modular Kitchen',
      refrigerator: 'Refrigerator',
      washing_machine: 'Washing Machine',
      microwave: 'Microwave',
      gas_stove: 'Gas Stove',
      water_purifier: 'Water Purifier',
      mixer_grinder: 'Mixer Grinder',
      toaster: 'Toaster',
      dishwasher: 'Dishwasher',
      
      // Additional
      office_desk: 'Office Desk',
      computer_chair: 'Computer Chair',
      shoe_rack: 'Shoe Rack',
      mirror: 'Mirror',
      curtains: 'Curtains',
      carpet: 'Carpet',
      air_conditioner: 'Air Conditioner',
      ceiling_fan: 'Ceiling Fan',
      table_fan: 'Table Fan',
      geyser: 'Geyser',
      water_heater: 'Water Heater'
    }
  },
  nearby_facilities: {
    title: 'Nearby Facilities',
    icon: '📍',
    items: {
      // Healthcare
      hospital: 'Hospital',
      clinic: 'Clinic',
      pharmacy: 'Pharmacy',
      diagnostic_center: 'Diagnostic Center',
      dental_clinic: 'Dental Clinic',
      
      // Education
      school: 'School',
      college: 'College',
      university: 'University',
      coaching_center: 'Coaching Center',
      library: 'Library',
      play_school: 'Play School',
      
      // Transportation
      metro_station: 'Metro Station',
      bus_stop: 'Bus Stop',
      railway_station: 'Railway Station',
      airport: 'Airport',
      taxi_stand: 'Taxi Stand',
      auto_rickshaw_stand: 'Auto Rickshaw Stand',
      
      // Shopping & Entertainment
      shopping_mall: 'Shopping Mall',
      supermarket: 'Supermarket',
      local_market: 'Local Market',
      cinema_hall: 'Cinema Hall',
      multiplex: 'Multiplex',
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      food_court: 'Food Court',
      
      // Banking & Finance
      bank: 'Bank',
      atm: 'ATM',
      post_office: 'Post Office',
      insurance_office: 'Insurance Office',
      
      // Recreation & Sports
      park: 'Park',
      gym: 'Gym',
      swimming_pool: 'Swimming Pool',
      sports_club: 'Sports Club',
      community_hall: 'Community Hall',
      
      // Essential Services
      police_station: 'Police Station',
      fire_station: 'Fire Station',
      petrol_pump: 'Petrol Pump',
      service_center: 'Service Center',
      laundry: 'Laundry',
      dry_cleaning: 'Dry Cleaning',
      
      // Religious Places
      temple: 'Temple',
      mosque: 'Mosque',
      church: 'Church',
      gurudwara: 'Gurudwara',
      
      // Other
      beauty_parlor: 'Beauty Parlor',
      salon: 'Salon',
      spa: 'Spa',
      pet_clinic: 'Pet Clinic',
      veterinary_hospital: 'Veterinary Hospital'
    }
  }
};

export default function PropertyAmenitiesManager({ 
  initialAmenities = {}, 
  onAmenitiesChange 
}: PropertyAmenitiesManagerProps) {
  const [amenities, setAmenities] = useState<PropertyAmenities>(initialAmenities);

  useEffect(() => {
    setAmenities(initialAmenities);
  }, [initialAmenities]);

  const handleAmenityChange = (category: keyof PropertyAmenities, amenityName: string, checked: boolean) => {
    const newAmenities = {
      ...amenities,
      [category]: {
        ...amenities[category],
        [amenityName]: checked
      }
    };
    
    setAmenities(newAmenities);
    onAmenitiesChange(newAmenities);
  };

  const handleCategoryToggle = (category: keyof PropertyAmenities, checked: boolean) => {
    const categoryItems = (AMENITY_CATEGORIES as any)[category]?.items;
    if (!categoryItems) return;

    const newAmenities = {
      ...amenities,
      [category]: Object.keys(categoryItems).reduce((acc, item) => {
        acc[item] = checked;
        return acc;
      }, {} as Record<string, boolean>)
    };

    setAmenities(newAmenities);
    onAmenitiesChange(newAmenities);
  };

  const getSelectedCount = (category: keyof PropertyAmenities) => {
    const categoryAmenities = amenities[category];
    if (!categoryAmenities) return 0;
    return Object.values(categoryAmenities).filter(Boolean).length;
  };

  const getTotalCount = (category: keyof PropertyAmenities) => {
    return Object.keys((AMENITY_CATEGORIES as any)[category]?.items || {}).length;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {Object.entries(AMENITY_CATEGORIES).map(([categoryKey, category]) => {
          const categoryAmenities = amenities[categoryKey as keyof PropertyAmenities] || {};
          const selectedCount = getSelectedCount(categoryKey as keyof PropertyAmenities);
          const totalCount = getTotalCount(categoryKey as keyof PropertyAmenities);

          return (
            <div key={categoryKey} className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">{category.title}</h4>
                </div>
                <div className="flex items-center justify-between sm:space-x-3">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {selectedCount}/{totalCount}
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`select-all-${categoryKey}`}
                      checked={selectedCount === totalCount && totalCount > 0}
                      onChange={(e) => handleCategoryToggle(categoryKey as keyof PropertyAmenities, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`select-all-${categoryKey}`} className="text-xs text-gray-600">
                      All
                    </label>
                  </div>
                </div>
              </div>

              <div className={`grid gap-2 sm:gap-3 ${
                categoryKey === 'furniture_amenities' || categoryKey === 'nearby_facilities' 
                  ? 'grid-cols-1 sm:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {Object.entries(category.items).map(([itemKey, itemLabel]) => (
                  <div key={itemKey} className="flex items-center p-1 rounded hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      id={`${categoryKey}-${itemKey}`}
                      checked={(categoryAmenities as any)[itemKey] || false}
                      onChange={(e) => handleAmenityChange(categoryKey as keyof PropertyAmenities, itemKey, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                    />
                    <label 
                      htmlFor={`${categoryKey}-${itemKey}`} 
                      className="ml-2 sm:ml-3 text-xs sm:text-sm text-gray-700 cursor-pointer leading-relaxed"
                    >
                      {itemLabel}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section - Mobile Responsive */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 text-sm sm:text-base">Selected Amenities Summary</h4>
            <p className="text-xs sm:text-sm text-blue-700 mt-1">
              Total amenities selected: {Object.values(amenities).reduce((total, category) => {
                if (category && typeof category === 'object') {
                  return total + Object.values(category).filter(Boolean).length;
                }
                return total;
              }, 0)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const emptyAmenities = Object.keys(AMENITY_CATEGORIES).reduce((acc, category) => {
                acc[category as keyof PropertyAmenities] = {};
                return acc;
              }, {} as PropertyAmenities);
              setAmenities(emptyAmenities);
              onAmenitiesChange(emptyAmenities);
            }}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
