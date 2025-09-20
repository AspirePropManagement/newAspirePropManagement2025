'use client';

import React, { useState, useEffect, useMemo } from 'react';
import GooglePlacesAutocomplete from '../GooglePlacesAutocomplete';

/**
 * Property Valuation component for estimating property market value
 */
export const PropertyValuation: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [floor, setFloor] = useState<string>('');
  const [furnishing, setFurnishing] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [estimatedValue, setEstimatedValue] = useState<number>(0);
  const [pricePerSqFt, setPricePerSqFt] = useState<number>(0);

  // Base prices per sq ft for different locations (sample data)
  const locationPrices = useMemo(() => ({
    'hinjawadi': 8500,
    'koregaon-park': 12000,
    'kharadi': 7500,
    'baner': 9000,
    'wakad': 8000,
    'pune': 7000,
  }), []);

  // Calculate property value when inputs change
  useEffect(() => {
    if (propertyType && location && area) {
      const basePrice = locationPrices[location as keyof typeof locationPrices] || 7000;
      const areaValue = parseFloat(area);
      const ageValue = parseFloat(age) || 0;
      const floorValue = parseFloat(floor) || 1;

      if (areaValue > 0) {
        let calculatedPrice = basePrice * areaValue;

        // Adjustments based on property type
        if (propertyType === 'gated_community_villa_or_bungalow') {
          calculatedPrice *= 1.2; // 20% premium for villas
        } else if (propertyType === 'commercial') {
          calculatedPrice *= 1.5; // 50% premium for commercial
        }

        // Age depreciation (2% per year, max 30%)
        const ageDepreciation = Math.min(ageValue * 0.02, 0.3);
        calculatedPrice *= (1 - ageDepreciation);

        // Floor premium (ground floor: -5%, top floor: +10%, others: +5%)
        if (floorValue === 1) {
          calculatedPrice *= 0.95;
        } else if (floorValue >= 4) {
          calculatedPrice *= 1.1;
        } else {
          calculatedPrice *= 1.05;
        }

        // Furnishing premium
        if (furnishing === 'fully_furnished') {
          calculatedPrice *= 1.15;
        } else if (furnishing === 'semi_furnished') {
          calculatedPrice *= 1.05;
        }

        // Amenities premium (5% per amenity, max 30%)
        const amenitiesPremium = Math.min(amenities.length * 0.05, 0.3);
        calculatedPrice *= (1 + amenitiesPremium);

        setEstimatedValue(calculatedPrice);
        setPricePerSqFt(calculatedPrice / areaValue);
      }
    } else {
      setEstimatedValue(0);
      setPricePerSqFt(0);
    }
  }, [propertyType, location, area, age, floor, furnishing, amenities, locationPrices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleAmenityToggle = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleReset = () => {
    setPropertyType('');
    setLocation('');
    setArea('');
    setAge('');
    setFloor('');
    setFurnishing('');
    setAmenities([]);
  };

  const amenityOptions = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Lift', 'Power Backup',
    'Club House', 'Garden', 'Playground', 'Shopping Center', 'School Nearby', 'Hospital Nearby'
  ];

  return (
    <div className="w-full px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Valuation</h1>
        <p className="text-gray-600">Get instant property valuation and market price estimates for your property</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
          
          <div className="space-y-6">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              >
                <option value="">Select Property Type</option>
                <option value="apartment">Apartment</option>
                <option value="gated_community_villa_or_bungalow">Villa/Bungalow</option>
                <option value="independent_house">Independent House</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <GooglePlacesAutocomplete
                value={location}
                onChange={(value) => setLocation(value)}
                placeholder="Search location (e.g., Pune, Maharashtra)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Built-up Area (sq ft)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter built-up area"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Age (years)
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter property age"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Floor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Floor Number
              </label>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="Enter floor number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              />
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing Status
              </label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              >
                <option value="">Select Furnishing</option>
                <option value="un_furnished">Unfurnished</option>
                <option value="semi_furnished">Semi Furnished</option>
                <option value="fully_furnished">Fully Furnished</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Valuation</h2>
          
          {estimatedValue > 0 ? (
            <div className="space-y-6">
              {/* Estimated Value */}
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium mb-1">Estimated Property Value</div>
                <div className="text-3xl font-bold text-orange-600">{formatCurrency(estimatedValue)}</div>
              </div>

              {/* Price per Sq Ft */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium mb-1">Price per Sq Ft</div>
                <div className="text-2xl font-bold text-blue-600">₹{pricePerSqFt.toLocaleString('en-IN')}</div>
              </div>

              {/* Property Details Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 font-medium mb-2">Property Summary</div>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>Type: {propertyType.replace('_', ' ').toUpperCase()}</div>
                  <div>Location: {location.replace('-', ' ').toUpperCase()}</div>
                  <div>Area: {area} sq ft</div>
                  <div>Age: {age || 0} years</div>
                  <div>Floor: {floor || 1}</div>
                  <div>Furnishing: {furnishing.replace('_', ' ').toUpperCase()}</div>
                  <div>Amenities: {amenities.length} selected</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-500">Enter property details to get valuation estimate</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">About Property Valuation</h3>
        <div className="text-blue-800 space-y-2">
          <p>• This is an estimated valuation based on current market trends and property characteristics.</p>
          <p>• Actual property value may vary based on specific location, market conditions, and other factors.</p>
          <p>• For accurate valuation, consider getting a professional property appraisal.</p>
          <p>• Property values are influenced by location, amenities, age, condition, and market demand.</p>
        </div>
      </div>
    </div>
  );
};
