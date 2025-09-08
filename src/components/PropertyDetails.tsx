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
    { label: 'Property Type', value: details.propertyType },
    { label: 'BHK Type', value: details.bhkType },
    { label: 'Carpet Area', value: `${details.carpetArea} sq ft` },
    { label: 'Built-up Area', value: `${details.squareFeet} sq ft` },
    { label: 'Status', value: details.status },
    { label: 'Location', value: details.location },
  ];

  const pricingDetails = [
    { label: 'Price', value: `₹${details.price.toLocaleString('en-IN')}` },
    { label: 'Price per sq ft', value: `₹${Math.round(details.price / details.carpetArea).toLocaleString('en-IN')}` },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Basic Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicDetails.map((detail, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-1">{detail.label}</span>
              <span className="text-lg text-gray-900">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pricingDetails.map((detail, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-sm font-medium text-gray-500 mb-1">{detail.label}</span>
              <span className="text-xl font-semibold text-green-600">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Property Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
        <p className="text-gray-700 leading-relaxed">{details.description}</p>
      </div>

      {/* Specifications */}
      {specifications && Object.keys(specifications).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="text-sm font-medium text-gray-500 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <span className="text-gray-900">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <div key={index} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Interested in this Property?</h3>
        <p className="text-blue-700 mb-4">
          Contact us for more information, site visits, or to schedule a virtual tour.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Schedule Site Visit
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            Virtual Tour
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
}
