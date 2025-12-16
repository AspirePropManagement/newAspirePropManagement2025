'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useAdsBanners } from '@/hooks/useAdsBanners';
import { BannerLocation } from '@/types/AdsBanner';

interface AdsBannerSectionProps {
  location: BannerLocation;
}

/**
 * AdsBannerSection component displays ads banners with enquiry functionality
 * Shows banners in a responsive grid layout with enquiry buttons
 */
export function AdsBannerSection({ location }: AdsBannerSectionProps) {
  const { banners, loading, error } = useAdsBanners(location);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Always show one ad at a time (carousel)
  // Works for any number of ads (1..10) - shows all uploaded banners
  const totalSlides = banners.length || 1;
  const maxIndex = Math.max(0, totalSlides - 1);
  
  // Check if user can control (has navigation buttons)
  const hasUserControls = banners.length > 1;

  // Auto-rotate carousel only if user has controls (navigation buttons)
  // If user can control: slow down auto-scroll (8 seconds)
  // If user cannot control: no auto-scroll
  useEffect(() => {
    if (hasUserControls && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 8000); // Change slide every 8 seconds (slower than before)

      return () => clearInterval(interval);
    }
    // If no user controls, don't auto-scroll
  }, [banners.length, maxIndex, hasUserControls]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-300 ease-in-out">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg aspect-[4/1]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover exclusive real estate opportunities and premium developments.
            </p>
          </div>

          {/* Ads Carousel */}
          <div className="relative">
            {/* Navigation Buttons - Only show if there are multiple ads */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  aria-label="Previous ad"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  aria-label="Next ad"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Carousel Indicators - hidden by design */}
            {false && banners.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? 'w-8 bg-blue-600'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Carousel Container */}
            <div className="overflow-hidden w-full">
              <div 
                className="flex transition-transform duration-300 ease-in-out w-full"
                style={{ 
                  transform: `translateX(-${currentIndex * 100}%)`,
                  maxWidth: '100%'
                }}
              >
                {banners.length > 0 ? (
                  banners.map((banner, index) => (
                    <div 
                      key={banner.id} 
                      className="w-full flex-shrink-0" 
                      style={{ maxWidth: '100%' }}
                    >
                      <div className="w-full px-1 sm:px-2">
                        <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                          {/* Banner Image */}
                          <div className="relative aspect-[4/1] overflow-hidden">
                              <img
                                src={`data:${banner.image_mime};base64,${banner.image_base64}`}
                                alt={banner.alt_text || banner.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-property.svg';
                                }}
                              />
                              
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
                            
                            {/* Content Overlay - only button centered */}
                            <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
                              <Link
                                href={banner.link_url || "/contact"}
                                className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm md:px-6 md:py-3 md:text-base rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100"
                              >
                                Enquire Now
                              </Link>
                            </div>
                            {/* AD Label chip */}
                            <div className="absolute top-3 left-3">
                              <span className="bg-gray-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
                                AD
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Placeholder when no banners available
                  <div className="w-full flex-shrink-0">
                    <div className="w-full px-1 sm:px-2">
                      <div className="relative group overflow-hidden rounded-lg shadow-lg">
                        <div className="relative aspect-[4/1] overflow-hidden bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-gray-500 text-sm">No ads available at the moment</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
