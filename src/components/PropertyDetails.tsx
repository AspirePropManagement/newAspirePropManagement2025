'use client';

import React from 'react';

interface PropertyDetailsProps {
  details: {
    title: string;
    price: number;
    location: string;
    bhkType: string;
    carpetArea: number;
    squareFeet: number;
    propertyType: string;
    status: string;
    description: string;
  };
  specifications: Record<string, any>;
  className?: string;
}

/**
 * Property details component that displays comprehensive property information
 * including specifications, features, and key details
 */
export function PropertyDetails({ details, specifications, className = '' }: PropertyDetailsProps) {
  const basicDetails = [
    { 
      label: details.type === 'new_project' ? 'Project Type' : 'Property Type', 
      value: details.propertyType || 'N/A' 
    },
    { label: 'BHK Type', value: details.bhkType || 'N/A' },
    { label: 'Carpet Area', value: details.carpetArea > 0 ? `${details.carpetArea} sq ft` : 'N/A' },
    { label: 'Built-up Area', value: details.squareFeet > 0 ? `${details.squareFeet} sq ft` : 'N/A' },
    { label: 'Status', value: details.status || 'Available' },
    { label: 'Location', value: details.location || 'Location not specified' },
  ];

  const pricingDetails = [
    { label: 'Price', value: details.price > 0 ? `₹${details.price.toLocaleString('en-IN')}` : 'Price on request' },
    { label: 'Price per sq ft', value: details.price > 0 && details.carpetArea > 0 ? `₹${Math.round(details.price / details.carpetArea).toLocaleString('en-IN')}` : 'N/A' },
  ];

  return (
    <div className={`space-y-6 sm:space-y-8 ${className}`}>
      {/* Basic Details */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Basic Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {basicDetails.map((detail, index) => (
            <div key={index} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <span className="text-sm font-medium text-gray-500 mb-2 block">{detail.label}</span>
              <span className="text-lg sm:text-xl text-gray-900 font-semibold">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          Pricing Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {pricingDetails.map((detail, index) => (
            <div key={index} className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-500 mb-2 block">{detail.label}</span>
              <span className="text-2xl sm:text-3xl font-bold text-green-600">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Property Description */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Description
        </h3>
        <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">{details.description}</p>
        </div>
      </div>

      {/* Specifications */}
      {specifications && Object.keys(specifications).length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <span className="text-sm font-medium text-gray-500 mb-2 block">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-base sm:text-lg text-gray-900 font-semibold">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Features */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6 sm:p-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          Key Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            'Spacious Living Areas',
            'Modern Kitchen Design',
            'Premium Bathroom Fittings',
            'Balcony with Scenic Views',
            'Parking Space',
            'Power Backup',
            'Security System',
            'Lift Access',
            'Garden Area',
            'Club House',
            'Swimming Pool',
            'Gymnasium'
          ].map((feature, index) => (
            <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm sm:text-base text-gray-700 font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
