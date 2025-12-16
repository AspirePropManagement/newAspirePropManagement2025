'use client';

import React, { useState } from 'react';
import { PropertyEnquiryForm } from './PropertyEnquiryForm';

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
    type?: string;
    id?: string;
  };
  specifications: Record<string, any>;
  className?: string;
  depositAmount?: number;
  enquirySubmitted?: boolean;
  onEnquirySubmitted?: () => void;
}

/**
 * Property details component that displays comprehensive property information
 * including specifications, features, and key details
 */
export function PropertyDetails({ details, specifications, className = '', depositAmount, enquirySubmitted = false, onEnquirySubmitted }: PropertyDetailsProps) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  // Extract owner information from specifications
  const ownerInfo = {
    name: specifications['Owner Name'] || specifications['Seller Name'] || null,
    email: specifications['Owner Email'] || specifications['Seller Email'] || null,
    contact: specifications['Owner Contact'] || specifications['Seller Contact'] || specifications['Seller Contact No'] || null,
    alternateContact: specifications['Owner Alternate Contact'] || specifications['Seller Alternate No'] || null
  };

  const hasOwnerInfo = ownerInfo.name || ownerInfo.email || ownerInfo.contact;
  const basicDetails = [
    { 
      label: details.type === 'new_project' ? 'Project Type' : 'Property Type', 
      value: details.propertyType || 'N/A' 
    },
    { label: 'BHK Type', value: details.bhkType || 'N/A' },
    ...(details.carpetArea && details.carpetArea > 0 ? [{ label: 'Carpet Area', value: `${details.carpetArea} sq ft` }] : []),
    { label: 'Built-up Area', value: details.squareFeet && details.squareFeet > 0 ? `${details.squareFeet} sq ft` : 'N/A' },
    { label: 'Status', value: details.status || 'Available' },
    { label: 'Location', value: details.location || 'Location not specified' },
  ];

  // For rental: combine rent and deposit in same card, no price/sqft
  // For others: show price and price/sqft
  const isRental = details.type === 'rental';
  const pricingDetails = isRental 
    ? [
        { label: 'Rent Amount', value: details.price > 0 ? `₹${details.price.toLocaleString('en-IN')}/month` : 'Price on request' },
        ...(depositAmount ? [{ label: 'Deposit Amount', value: `₹${depositAmount.toLocaleString('en-IN')}` }] : specifications?.Deposit ? [{ label: 'Deposit Amount', value: specifications.Deposit }] : [])
      ]
    : [
        { label: 'Price', value: details.price > 0 ? `₹${details.price.toLocaleString('en-IN')}` : 'Price on request' },
        ...(details.price > 0 && details.carpetArea > 0 ? [{ label: 'Price per sq ft', value: `₹${Math.round(details.price / details.carpetArea).toLocaleString('en-IN')}` }] : [])
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

      {/* Owner Information - Single blurred card */}
      {hasOwnerInfo && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Owner Information
          </h3>
          {!enquirySubmitted ? (
            <div 
              onClick={() => setShowEnquiryModal(true)}
              className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border-2 border-dashed border-yellow-300 hover:border-yellow-400 cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div className="space-y-4">
                {ownerInfo.name && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Owner Name</span>
                    <div className="text-lg font-semibold text-gray-400 blur-sm select-none">●●●●●●●●</div>
                  </div>
                )}
                {ownerInfo.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Owner Email</span>
                    <div className="text-lg font-semibold text-gray-400 blur-sm select-none">●●●●●●●●●●●●</div>
                  </div>
                )}
                {ownerInfo.contact && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 block mb-2">Owner Contact</span>
                    <div className="text-lg font-semibold text-gray-400 blur-sm select-none">●●●●●●●●●●</div>
                  </div>
                )}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 italic">
                  Click here to fill enquiry form and view owner details
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {ownerInfo.name && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <span className="text-sm font-medium text-gray-500 mb-2 block">Owner Name</span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900">{ownerInfo.name}</span>
                  </div>
                )}
                {ownerInfo.email && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <span className="text-sm font-medium text-gray-500 mb-2 block">Owner Email</span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900 break-all">{ownerInfo.email}</span>
                  </div>
                )}
                {ownerInfo.contact && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <span className="text-sm font-medium text-gray-500 mb-2 block">Owner Contact</span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900">{ownerInfo.contact}</span>
                  </div>
                )}
                {ownerInfo.alternateContact && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                    <span className="text-sm font-medium text-gray-500 mb-2 block">Alternate Contact</span>
                    <span className="text-base sm:text-lg font-semibold text-gray-900">{ownerInfo.alternateContact}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Specifications - Remove duplicates and owner info */}
      {specifications && Object.keys(specifications).length > 0 && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Specifications
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Object.entries(specifications)
              .filter(([key]) => {
                // Remove fields that are already shown in Basic Details, Pricing, or Owner Info
                const excludedKeys = [
                  'Property Type', 'Project Type', 'BHK Type', 'Carpet Area', 'Built-up Area', 
                  'Square Feet', 'Status', 'Location', 'Price', 'Rent Amount', 'Deposit', 
                  'Price Per Sq Ft', 'Owner Name', 'Owner Email', 'Owner Contact', 
                  'Owner Alternate Contact', 'Seller Name', 'Seller Email', 'Seller Contact',
                  'Seller Contact No', 'Seller Alternate No'
                ];
                return !excludedKeys.some(excluded => key.includes(excluded) || excluded.includes(key));
              })
              .map(([key, value]) => (
                <div key={key} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <span className="text-sm font-medium text-gray-500 mb-2 block">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowEnquiryModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Enquire about this property</h2>
              <button
                onClick={() => setShowEnquiryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PropertyEnquiryForm
              propertyTitle={details.title}
              propertyId={details.id || ''}
              propertyType={details.type || ''}
              propertyPrice={details.price > 0 ? `₹${details.price.toLocaleString('en-IN')}` : undefined}
              propertyLocation={details.location}
              onEnquirySubmitted={() => {
                if (onEnquirySubmitted) {
                  onEnquirySubmitted();
                }
                setShowEnquiryModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Property Description - Moved to last position below Specifications */}
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

    </div>
  );
}
