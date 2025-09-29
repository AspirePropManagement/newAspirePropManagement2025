'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAdsBanners } from '@/hooks/useAdsBanners';
import { BannerLocation } from '@/types/AdsBanner';
import { EnquiryForm } from '@/components/EnquiryForm';

interface AdsBannerSectionProps {
  location: BannerLocation;
}

/**
 * AdsBannerSection component displays ads banners with enquiry functionality
 * Shows banners in a responsive grid layout with enquiry buttons
 */
export function AdsBannerSection({ location }: AdsBannerSectionProps) {
  const { banners, loading, error } = useAdsBanners(location);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<string | null>(null);

  const handleEnquiryClick = (bannerId: string, title: string) => {
    setSelectedBanner(title);
    setShowEnquiryForm(true);
  };

  const closeEnquiryForm = () => {
    setShowEnquiryForm(false);
    setSelectedBanner(null);
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg aspect-[4/1]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Ads banner error:', error);
    // Show placeholder instead of hiding section on error
  }

  return (
    <>
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover exclusive real estate opportunities and premium developments.
            </p>
          </div>

          {/* Ads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.length > 0 ? (
              banners.map((banner) => (
              <div
                key={banner.id}
                className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Banner Image */}
                <div className="relative aspect-[4/1]">
                  <Image
                    src={`data:${banner.image_mime};base64,${banner.image_base64}`}
                    alt={banner.alt_text || banner.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-property.svg';
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-white text-center">
                      <h3 className="text-xl md:text-2xl font-bold mb-4 drop-shadow-lg">
                        {banner.title}
                      </h3>
                      
                      {/* Enquiry Button - Show only on hover */}
                      <button
                        onClick={() => handleEnquiryClick(banner.id, banner.title)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                  
                  {/* AD Label */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-gray-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
                      AD
                    </span>
                  </div>
                </div>
              </div>
              ))
            ) : (
              // Placeholder when no banners available
              <>
                <div className="relative group overflow-hidden rounded-lg shadow-lg">
                  <div className="relative aspect-[4/1] bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-lg font-semibold mb-3">Premium Opportunity</h3>
                      <button 
                        onClick={() => handleEnquiryClick('placeholder-1', 'Premium Opportunity')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                      >
                        Enquire Now
                      </button>
                    </div>
                    {/* AD Label */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-gray-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
                        AD
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="relative group overflow-hidden rounded-lg shadow-lg">
                  <div className="relative aspect-[4/1] bg-gradient-to-r from-gray-300 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="text-lg font-semibold mb-3">Luxury Development</h3>
                      <button 
                        onClick={() => handleEnquiryClick('placeholder-2', 'Luxury Development')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                      >
                        Enquire Now
                      </button>
                    </div>
                    {/* AD Label */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-gray-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
                        AD
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enquiry Form Modal */}
      {showEnquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Enquiry for {selectedBanner}
                </h3>
                <button
                  onClick={closeEnquiryForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <EnquiryForm onSubmitSuccess={closeEnquiryForm} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
