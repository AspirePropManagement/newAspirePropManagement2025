'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { ResaleProperty } from '@/types/ResaleProperty';

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
   * Gets the primary image for a property
   */
  const getPropertyImage = (property: ResaleProperty): string => {
    // Try property images first
    if (property.property_images?.exterior?.length) {
      return property.property_images.exterior[0];
    }
    if (property.property_images?.interior?.length) {
      return property.property_images.interior[0];
    }
    
    // Try general photos
    if (property.general_photos?.exterior?.length) {
      return property.general_photos.exterior[0];
    }
    if (property.general_photos?.interior?.length) {
      return property.general_photos.interior[0];
    }
    
    // Default placeholder
    return '/placeholder-property.svg';
  };

  /**
   * Gets all available images for a property
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Resale Properties</h2>
          <p className="text-gray-600">No resale properties available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Resale Properties</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover premium resale properties from verified owners and trusted agents.
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
                            href={`/properties/resale/${property.id}`}
                            className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer block"
                          >
                            {/* Property Image */}
                            <div className="relative h-48 overflow-hidden">
                              <Image
                                src={getPropertyImage(property)}
                                alt={formatPropertyName(property)}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-property.svg';
                                }}
                              />
                              
                              {/* Price Badge */}
                              <div className="absolute top-3 right-3">
                                <span className="bg-green-600 text-white text-sm px-2 py-1 rounded-full font-semibold shadow-lg">
                                  {formatPrice(property.asking_price)}
                                </span>
                              </div>

                              {/* Property Type Badge */}
                              <div className="absolute top-3 left-3">
                                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                  {property.bhk_type.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                            </div>

                            {/* Property Details */}
                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2">
                                {formatPropertyName(property)}
                              </h3>
                              
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

      {/* Image Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
            >
              <XMarkIcon className="w-6 h-6 text-white" />
            </button>

            {/* Image Navigation */}
            {getAllPropertyImages(selectedProperty).length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronRightIcon className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="relative w-full h-full max-h-[80vh] max-w-[90vw]">
              <Image
                src={getAllPropertyImages(selectedProperty)[selectedImageIndex]}
                alt={formatPropertyName(selectedProperty)}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-property.svg';
                }}
              />
            </div>

            {/* Property Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-60 text-white p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">{formatPropertyName(selectedProperty)}</h3>
              <p className="text-sm mb-1">{selectedProperty.location}</p>
              <p className="text-lg font-semibold text-green-400">{formatPrice(selectedProperty.asking_price)}</p>
              
              {/* Image Counter */}
              {getAllPropertyImages(selectedProperty).length > 1 && (
                <p className="text-xs text-gray-300 mt-2">
                  {selectedImageIndex + 1} of {getAllPropertyImages(selectedProperty).length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
