'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface RentalProperty {
  id: string;
  owner_name: string;
  property_type: string;
  bhk_type: string;
  location: string;
  rent_amount: number;
  deposit_amount?: number;
  furnishing_type: string;
  property_images?: {
    general_photos?: {
      exterior?: string[];
      interior?: string[];
      bedrooms?: string[];
      kitchen?: string[];
      bathrooms?: string[];
      living_dining?: string[];
    };
  };
  amenities?: {
    parking_type?: string;
    pets_allowed?: boolean;
    allowed_for_family?: boolean;
    allowed_for_bachelor?: boolean;
    immediate_possession?: boolean;
  };
  status?: string;
  created_at: string;
}

interface RentalPropertiesCarouselProps {
  properties: RentalProperty[];
}

/**
 * RentalPropertiesCarousel component displays rental properties in a horizontal carousel
 * Shows 4 cards at a time with navigation controls
 */
export function RentalPropertiesCarousel({ properties }: RentalPropertiesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsPerSlide, setCardsPerSlide] = useState(1);

  // Update cards per slide based on screen size
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 768) {
        setCardsPerSlide(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2); // Tablet: 2 cards
      } else {
        setCardsPerSlide(4); // Desktop: 4 cards
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  // Calculate how many slides we need
  const totalSlides = Math.ceil(properties.length / cardsPerSlide);
  const maxIndex = Math.max(0, totalSlides - 1);

  useEffect(() => {
    if (properties.length > 0) {
      setIsLoading(false);
    }
  }, [properties]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  /**
   * Gets the primary image for a rental property
   * Prioritizes interior photos, then exterior photos
   */
  const getPropertyImage = (property: RentalProperty): string => {
    const images = property.property_images;
    
    // Try interior photos first
    if (images?.general_photos?.interior?.length) {
      return images.general_photos.interior[0];
    }
    
    // Try living/dining area
    if (images?.general_photos?.living_dining?.length) {
      return images.general_photos.living_dining[0];
    }
    
    // Try bedrooms
    if (images?.general_photos?.bedrooms?.length) {
      return images.general_photos.bedrooms[0];
    }
    
    // Try kitchen
    if (images?.general_photos?.kitchen?.length) {
      return images.general_photos.kitchen[0];
    }
    
    // Try exterior photos
    if (images?.general_photos?.exterior?.length) {
      return images.general_photos.exterior[0];
    }
    
    // Default placeholder
    return '/placeholder-property.svg';
  };

  /**
   * Gets amenities for display
   */
  const getAmenities = (property: RentalProperty): string[] => {
    const amenities = property.amenities;
    if (!amenities) return [];
    
    const amenityList = [];
    if (amenities.parking_type) amenityList.push(amenities.parking_type.replace('_', ' '));
    if (amenities.pets_allowed) amenityList.push('Pets Allowed');
    if (amenities.immediate_possession) amenityList.push('Immediate Possession');
    if (amenities.allowed_for_family) amenityList.push('Family Friendly');
    if (amenities.allowed_for_bachelor) amenityList.push('Bachelor Friendly');
    
    return amenityList.slice(0, 3); // Show only first 3 amenities
  };

  /**
   * Formats rent amount for display
   */
  const formatRent = (amount: number): string => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)} Lacs/month`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K/month`;
    } else {
      return `₹${amount.toLocaleString()}/month`;
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rental Properties</h2>
          <p className="text-gray-600">No rental properties available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rental Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your perfect rental home from our curated collection of properties available for rent.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative mb-8">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                aria-label="Previous properties"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                aria-label="Next properties"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Properties Grid */}
          <div className="overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-300 ease-in-out w-full"
              style={{ 
                transform: `translateX(-${currentIndex * 100}%)`,
                maxWidth: '100%'
              }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0" style={{ maxWidth: '100%' }}>
                  <div className={`grid gap-4 sm:gap-6 px-1 sm:px-2 pb-8 ${
                    cardsPerSlide === 1 ? 'grid-cols-1' :
                    cardsPerSlide === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                  }`} style={{ maxWidth: '100%' }}>
                    {properties
                      .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                      .map((property) => (
                        <Link
                          key={property.id}
                          href={`/properties/rental/${property.id}`}
                          className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105 hover:-translate-y-2"
                        >
                          {/* Property Image */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={getPropertyImage(property)}
                              alt={`${property.bhk_type} ${property.property_type}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-property.svg';
                              }}
                            />
                          {/* Verified Badge */}
                          <div className="absolute bottom-3 left-3">
                            <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium flex items-center shadow">
                              <CheckBadgeIcon className="w-3.5 h-3.5 mr-1 text-white" />
                              100% Verified
                            </span>
                          </div>
                            {/* Status Badge */}
                            {property.status && (
                              <div className="absolute top-3 left-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  property.status === 'available' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {property.status}
                                </span>
                              </div>
                            )}
                            {/* Furnishing Badge */}
                            <div className="absolute top-3 right-3">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {property.furnishing_type.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Property Details */}
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                              {property.bhk_type.replace('_', ' ').toUpperCase()} {property.property_type.replace('_', ' ').toUpperCase()}
                            </h3>
                            
                            {/* Rent Amount */}
                            <div className="mb-2">
                              <span className="text-lg font-bold text-green-600">
                                {formatRent(property.rent_amount)}/month
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {property.location}
                            </p>
                          </div>
                        </Link>
                      ))}
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
