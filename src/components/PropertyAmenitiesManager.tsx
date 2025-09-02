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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(AMENITY_CATEGORIES).map(([categoryKey, category]) => {
          const categoryAmenities = amenities[categoryKey as keyof PropertyAmenities] || {};
          const selectedCount = getSelectedCount(categoryKey as keyof PropertyAmenities);
          const totalCount = getTotalCount(categoryKey as keyof PropertyAmenities);

          return (
            <div key={categoryKey} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{category.icon}</span>
                  <h4 className="font-medium text-gray-900">{category.title}</h4>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
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

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(category.items).map(([itemKey, itemLabel]) => (
                  <div key={itemKey} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`${categoryKey}-${itemKey}`}
                      checked={(categoryAmenities as any)[itemKey] || false}
                      onChange={(e) => handleAmenityChange(categoryKey as keyof PropertyAmenities, itemKey, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`${categoryKey}-${itemKey}`} 
                      className="ml-3 text-sm text-gray-700 cursor-pointer"
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-blue-900">Selected Amenities Summary</h4>
            <p className="text-sm text-blue-700 mt-1">
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
            className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-blue-300 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
