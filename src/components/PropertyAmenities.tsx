'use client';

import React from 'react';

interface PropertyAmenitiesProps {
  amenities: string[];
  className?: string;
}

/**
 * Property amenities component that displays all available amenities
 * with icons and descriptions in an organized layout
 */
export function PropertyAmenities({ amenities, className = '' }: PropertyAmenitiesProps) {
  const amenityCategories = {
    'Lifestyle': [
      { name: 'Swimming Pool', icon: '🏊‍♂️', description: 'Olympic size swimming pool' },
      { name: 'Gymnasium', icon: '💪', description: 'Fully equipped fitness center' },
      { name: 'Club House', icon: '🏛️', description: 'Multi-purpose club house' },
      { name: 'Spa & Wellness', icon: '🧘‍♀️', description: 'Spa and wellness center' },
      { name: 'Banquet Hall', icon: '🎉', description: 'Grand banquet and event hall' },
      { name: 'Café & Restaurant', icon: '☕', description: 'In-house dining facilities' }
    ],
    'Recreation': [
      { name: 'Children Play Area', icon: '🎠', description: 'Safe and fun play area for kids' },
      { name: 'Sports Court', icon: '🏸', description: 'Badminton, tennis, and basketball courts' },
      { name: 'Jogging Track', icon: '🏃‍♂️', description: 'Dedicated jogging and walking track' },
      { name: 'Garden & Landscaping', icon: '🌳', description: 'Beautifully landscaped gardens' },
      { name: 'Party Lawn', icon: '🎪', description: 'Open space for outdoor events' },
      { name: 'Meditation Area', icon: '🧘', description: 'Peaceful meditation and yoga space' }
    ],
    'Security & Safety': [
      { name: '24/7 Security', icon: '🛡️', description: 'Round-the-clock security personnel' },
      { name: 'CCTV Surveillance', icon: '📹', description: 'Comprehensive CCTV coverage' },
      { name: 'Fire Safety', icon: '🚨', description: 'Advanced fire safety systems' },
      { name: 'Emergency Response', icon: '🚑', description: 'Quick emergency response team' },
      { name: 'Access Control', icon: '🔐', description: 'Biometric and card access control' },
      { name: 'Visitor Management', icon: '👥', description: 'Digital visitor management system' }
    ],
    'Convenience': [
      { name: 'Power Backup', icon: '⚡', description: '100% power backup for all units' },
      { name: 'Lift Access', icon: '🛗', description: 'High-speed elevators' },
      { name: 'Parking', icon: '🚗', description: 'Covered and open parking spaces' },
      { name: 'Housekeeping', icon: '🧹', description: 'Professional housekeeping services' },
      { name: 'Maintenance', icon: '🔧', description: '24/7 maintenance support' },
      { name: 'Concierge', icon: '🎩', description: 'Personal concierge services' }
    ],
    'Utilities': [
      { name: 'Water Supply', icon: '💧', description: '24/7 water supply with treatment' },
      { name: 'Gas Pipeline', icon: '🔥', description: 'Piped gas connection' },
      { name: 'Rainwater Harvesting', icon: '🌧️', description: 'Eco-friendly rainwater harvesting' },
      { name: 'Sewage Treatment', icon: '♻️', description: 'Advanced sewage treatment plant' },
      { name: 'Solar Power', icon: '☀️', description: 'Solar power integration' },
      { name: 'Waste Management', icon: '🗑️', description: 'Efficient waste management system' }
    ]
  };

  const getAmenityIcon = (amenityName: string) => {
    for (const category of Object.values(amenityCategories)) {
      const amenity = category.find(a => a.name === amenityName);
      if (amenity) return amenity.icon;
    }
    return '✨';
  };

  const getAmenityDescription = (amenityName: string) => {
    for (const category of Object.values(amenityCategories)) {
      const amenity = category.find(a => a.name === amenityName);
      if (amenity) return amenity.description;
    }
    return 'Premium amenity';
  };

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* All Amenities Overview */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Amenities</h3>
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{amenities.length} amenities available</span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-lg sm:text-xl md:text-2xl mr-2 sm:mr-3 flex-shrink-0">{getAmenityIcon(amenity)}</span>
              <span className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Categorized Amenities */}
      <div className="space-y-4 sm:space-y-6">
        {Object.entries(amenityCategories).map(([categoryName, categoryAmenities]) => {
          const availableAmenities = categoryAmenities.filter(amenity => 
            amenities.includes(amenity.name)
          );

          if (availableAmenities.length === 0) return null;

          return (
            <div key={categoryName} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">{categoryName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {availableAmenities.map((amenity, index) => (
                  <div key={index} className="flex items-start p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0">{amenity.icon}</span>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-1">{amenity.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{amenity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Amenities Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg sm:rounded-xl border border-blue-200 p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Premium Lifestyle</h3>
            <p className="text-xs sm:text-sm text-gray-600">Experience luxury living with world-class amenities</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{amenities.length}</div>
            <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Total Amenities</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600">24/7</div>
            <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Security & Maintenance</div>
          </div>
          <div className="text-center p-2 sm:p-3 bg-white/50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">100%</div>
            <div className="text-[10px] sm:text-xs text-gray-600 mt-1">Power Backup</div>
          </div>
        </div>
      </div>
    </div>
  );
}
