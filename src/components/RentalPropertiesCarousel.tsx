'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { extractPropertyImages, getImageSrc, isBase64Image } from '@/utils/imageUtils';

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
      living_dining_balcony?: string[];
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

  // Remove duplicates based on property ID
  const uniqueProperties = React.useMemo(() => {
    const seen = new Set<string>();
    return properties.filter((property) => {
      if (seen.has(property.id)) {
        return false;
      }
      seen.add(property.id);
      return true;
    });
  }, [properties]);

  // Update cards per slide based on screen size
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 768) {
        setCardsPerSlide(2); // Mobile: 2 cards
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2); // Tablet: 2 cards
      } else {
        setCardsPerSlide(3); // Desktop: 3 cards (wider cards)
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  // Calculate how many slides we need based on unique properties
  const totalSlides = Math.ceil(uniqueProperties.length / cardsPerSlide);
  const maxIndex = Math.max(0, totalSlides - 1);

  useEffect(() => {
    if (uniqueProperties.length > 0) {
      setIsLoading(false);
    }
  }, [uniqueProperties.length]);

  // Auto-scroll carousel (only if we have more than one slide)
  useEffect(() => {
    if (totalSlides <= 1 || isLoading || uniqueProperties.length <= cardsPerSlide) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000); // Auto-scroll every 5 seconds
    
    return () => clearInterval(interval);
  }, [totalSlides, maxIndex, isLoading, uniqueProperties.length, cardsPerSlide]);

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
   * Gets all images for a rental property from all categories
   */
  const getPropertyImages = (property: RentalProperty): string[] => {
    const images = extractPropertyImages(property);
    return images.length > 0 ? images : ['/placeholder-property.svg'];
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
      <div className="py-2 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

  if (uniqueProperties.length === 0) {
    return (
      <div className="py-2 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rental Properties</h2>
          <p className="text-gray-600">No rental properties available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rental Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find your perfect rental home from our curated collection of properties available for rent.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
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
                  <div className={`grid gap-3 sm:gap-4 md:gap-6 px-1 sm:px-2 pb-4 ${
                    cardsPerSlide === 2 ? 'grid-cols-2 md:grid-cols-2' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`} style={{ maxWidth: '100%' }}>
                    {uniqueProperties
                      .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                      .map((property) => {
                        const propertyImages = getPropertyImages(property);
                        return (
                          <RentalPropertyCardWithCarousel
                            key={property.id}
                            property={property}
                            images={propertyImages}
                          />
                        );
                      })}
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

/**
 * Rental property card component with image carousel
 */
function RentalPropertyCardWithCarousel({ property, images }: { property: RentalProperty; images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-scroll images
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  const formatRent = (rent: number) => {
    if (!rent || rent <= 0) return 'Rent on request';
    if (rent >= 100000) return `₹${(rent / 100000).toFixed(2)} Lacs/month`;
    return `₹${rent.toLocaleString('en-IN')}/month`;
  };

  return (
    <Link
      href={`/properties/rental/${property.id}`}
      className="group bg-white rounded-t-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 will-change-transform"
    >
      {/* Property Image Carousel */}
      <div className="relative h-36 sm:h-44 md:h-48 overflow-hidden">
        <div className="relative w-full h-full">
          {images.map((imageSrc, index) => (
            <Image
              key={index}
              src={getImageSrc(imageSrc)}
              alt={`${property.bhk_type} ${property.property_type}`}
              fill
              className={`object-cover transition-opacity duration-500 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-property.svg';
              }}
              unoptimized={isBase64Image(imageSrc)}
            />
          ))}
        </div>
        {/* Status Badge */}
        {property.status && (
          <div className="absolute top-2 left-2">
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${
              property.status === 'available' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-white'
            }`}>
              {property.status.charAt(0).toUpperCase() + property.status.slice(1).toLowerCase()}
            </span>
          </div>
        )}
        {/* Furnishing Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-600 text-white">
            {property.furnishing_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
            <div className="flex space-x-1 bg-black/30 backdrop-blur-sm rounded-full px-2 py-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-2 sm:p-3 md:p-4">
        <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
          {property.bhk_type.replace('_', ' ').toUpperCase()} {property.property_type.replace('_', ' ').toUpperCase()}
        </h3>
        
        {/* Rent Amount */}
        <div className="mb-1 sm:mb-2">
          <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
            {formatRent(property.rent_amount)}
          </span>
        </div>
        
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 flex items-center truncate">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </p>
      </div>
    </Link>
  );
}
