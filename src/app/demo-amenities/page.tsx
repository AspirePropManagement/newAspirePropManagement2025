'use client';

import React, { useState } from 'react';
import PropertyAmenitiesManager from '@/components/PropertyAmenitiesManager';
import { PropertyAmenities } from '@/types/PropertyAmenities';

export default function DemoAmenitiesPage() {
  const [amenities, setAmenities] = useState<PropertyAmenities>({});

  const handleAmenitiesChange = (newAmenities: PropertyAmenities) => {
    setAmenities(newAmenities);
    console.log('Amenities changed:', newAmenities);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Amenities Manager Demo
          </h1>
          <p className="text-lg text-gray-600">
            Test the PropertyAmenitiesManager component
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <PropertyAmenitiesManager
            initialAmenities={amenities}
            onAmenitiesChange={handleAmenitiesChange}
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Amenities Data (JSON)
          </h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(amenities, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
