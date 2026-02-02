'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { XMarkIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { ResaleProperty } from '@/types/ResaleProperty';
import { extractPropertyImages, getImageSrc, isBase64Image } from '@/utils/imageUtils';

interface ResalePropertiesCarouselProps {
  properties: ResaleProperty[];
}

/**
 * ResalePropertiesCarousel component displays resale properties in a horizontal carousel
 * Shows property name, image, and location with zoom modal on hover
 */
export function ResalePropertiesCarousel({ properties }: ResalePropertiesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<ResaleProperty | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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
        setCardsPerSlide(1); // Mobile: 1 card
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
   * Gets all images for a property from all categories
   */
  const getPropertyImages = (property: ResaleProperty): string[] => {
    const images = extractPropertyImages(property);
    return images.length > 0 ? images : ['/placeholder-property.svg'];
  };

  /**
   * Gets all available images for a property (legacy function - keeping for compatibility)
   */
  const getAllPropertyImages = (property: ResaleProperty): string[] => {
    const images: string[] = [];
    
    // Add property images
    if (property.property_images?.exterior) {
      images.push(...property.property_images.exterior);
    }
    if (property.property_images?.interior) {
      images.push(...property.property_images.interior);
    }
    if (property.property_images?.kitchen) {
      images.push(...property.property_images.kitchen);
    }
    if (property.property_images?.bathroom) {
      images.push(...property.property_images.bathroom);
    }
    if (property.property_images?.bedroom) {
      images.push(...property.property_images.bedroom);
    }
    if (property.property_images?.living_room) {
      images.push(...property.property_images.living_room);
    }
    if (property.property_images?.living_dining_balcony) {
      images.push(...property.property_images.living_dining_balcony);
    }
    
    // Add general photos
    if (property.general_photos?.exterior) {
      images.push(...property.general_photos.exterior);
    }
    if (property.general_photos?.interior) {
      images.push(...property.general_photos.interior);
    }
    
    return images.length > 0 ? images : ['/placeholder-property.svg'];
  };

  /**
   * Formats property name for display
   */
  const formatPropertyName = (property: ResaleProperty): string => {
    if (property.society_name) {
      return property.society_name;
    }
    return `${property.bhk_type.replace('_', ' ').toUpperCase()} ${property.property_type.replace('_', ' ')}`;
  };

  /**
   * Formats price for display
   */
  const formatPrice = (price: number): string => {
    if (price >= 10000000) { // 1 crore
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) { // 1 lakh
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const openModal = (property: ResaleProperty, imageIndex: number = 0) => {
    setSelectedProperty(property);
    setSelectedImageIndex(imageIndex);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedProperty) {
      const images = getAllPropertyImages(selectedProperty);
      setSelectedImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      const images = getAllPropertyImages(selectedProperty);
      setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Resale Properties</h2>
          <p className="text-gray-600">No resale properties available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Resale Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover premium resale properties from verified owners and trusted agents.
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
                  <div className={`grid gap-4 sm:gap-6 px-1 sm:px-2 pb-4 ${
                    cardsPerSlide === 1 ? 'grid-cols-1' :
                    cardsPerSlide === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  }`} style={{ maxWidth: '100%' }}>
                      {uniqueProperties
                        .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                        .map((property) => {
                          const propertyImages = getPropertyImages(property);
                          return (
                            <ResalePropertyCardWithCarousel
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

      {/* Image Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute top-4 right-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Image Navigation */}
            {getAllPropertyImages(selectedProperty).length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev <= 0 ? getAllPropertyImages(selectedProperty).length - 1 : prev - 1))}
                  className="absolute left-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev >= getAllPropertyImages(selectedProperty).length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Image Display */}
            <Image
              src={getAllPropertyImages(selectedProperty)[selectedImageIndex] || '/placeholder-property.svg'}
              alt="Property"
              fill
              className="object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-property.svg';
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Resale property card component with image carousel
 */
function ResalePropertyCardWithCarousel({ property, images }: { property: ResaleProperty; images: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-scroll images
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  const formatPrice = (price?: number) => {
    if (!price || price <= 0) return 'Price on request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lacs`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const formatPropertyName = (property: ResaleProperty) => {
    return property.society_name || property.property_type?.replace('_', ' ') || 'Resale Property';
  };

  const getBHKConfig = () => {
    const bhkMap: { [key: string]: string } = {
      '1_rk_1_bhk': '1 RK / 1 BHK',
      '1_rk': '1 RK',
      '1_bhk': '1 BHK',
      '2_bhk': '2 BHK',
      '3_bhk': '3 BHK',
      '4_bhk': '4 BHK',
      '5_bhk': '5 BHK',
      '5_plus_bhk': '5+ BHK'
    };
    return bhkMap[property.bhk_type] || property.bhk_type.replace('_', ' ').toUpperCase();
  };

  return (
    <Link
      href={`/properties/resale/${property.id}`}
      className="group bg-white rounded-t-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-gray-200 will-change-transform"
    >
      {/* Property Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        <div className="relative w-full h-full">
          {images.map((imageSrc, index) => (
            <Image
              key={index}
              src={getImageSrc(imageSrc)}
              alt={formatPropertyName(property)}
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
        {/* Soft overlay on hover for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {/* BHK Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-blue-600 text-white">
            {getBHKConfig()}
          </span>
        </div>
        {/* Furnishing Type Badge */}
        {property.furnishing_type && (
          <div className="absolute top-2 right-2">
            <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-orange-600 text-white">
              {property.furnishing_type.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        )}
        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3">
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
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
          {formatPropertyName(property)}
        </h3>

        {/* Config */}
        <p className="text-sm text-gray-900 mb-1">
          {getBHKConfig()}
        </p>

        {/* Price */}
        <p className="text-base font-bold text-gray-900 mb-2">
          {formatPrice(property.asking_price)}
        </p>
        
        {/* Location */}
        <p className="text-sm text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </p>
      </div>
    </Link>
  );
}
