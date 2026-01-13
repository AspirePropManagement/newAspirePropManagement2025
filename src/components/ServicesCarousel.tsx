'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Service } from '@/types/Service';

interface ServicesCarouselProps {
  services: Service[];
}

/**
 * ServicesCarousel component displays services in a horizontal carousel
 * Shows 4 cards at a time with navigation controls
 */
export function ServicesCarousel({ services }: ServicesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cardsPerSlide, setCardsPerSlide] = useState(4);

  // Update cards per slide based on screen size
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 768) {
        setCardsPerSlide(4); // Mobile: 4 cards (2 rows of 2)
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(4); // Tablet: 4 cards (2 rows of 2)
      } else {
        setCardsPerSlide(6); // Desktop: 6 cards (1 row)
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  // Calculate how many slides we need
  const totalSlides = Math.ceil(services.length / cardsPerSlide);
  const maxIndex = Math.max(0, totalSlides - 1);

  useEffect(() => {
    if (services.length > 0) {
      setIsLoading(false);
    }
  }, [services]);

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
   * Gets the primary image for a service
   * Prioritizes image_data, then service_images, then image_path
   */
  const getServiceImage = (service: Service): string => {
    // Try image_data first (base64 or direct image data)
    if (service.image_data) {
      // Check if it's base64 data
      if (service.image_data.startsWith('data:image/')) {
        return service.image_data;
      }
      // If it's a URL or path
      return service.image_data;
    }
    
    // Try service_images array
    if (service.service_images && service.service_images.length > 0) {
      return service.service_images[0].image_path;
    }
    
    // Try image_path
    if (service.image_path) {
      return service.image_path;
    }
    
    // Default placeholder
    return '/placeholder-property.svg';
  };

  /**
   * Gets the alt text for a service image
   */
  const getServiceImageAlt = (service: Service): string => {
    if (service.image_alt) {
      return service.image_alt;
    }
    if (service.service_images && service.service_images.length > 0 && service.service_images[0].alt_text) {
      return service.service_images[0].alt_text;
    }
    return service.service_name;
  };

  /**
   * Truncates text to specified length
   */
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (isLoading) {
    return (
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse flex flex-col items-center p-4">
                <div className="bg-gray-200 rounded-2xl w-20 h-20 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0 && !isLoading) {
    return (
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-600">No services available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive real estate services to help you achieve your property goals with professional expertise.
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
                aria-label="Previous services"
              >
                <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 border border-gray-200"
                aria-label="Next services"
              >
                <ChevronRightIcon className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Services Grid */}
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
                  <div className={`grid gap-2 px-1 sm:px-2 ${
                    cardsPerSlide === 4 ? 'grid-cols-2' :
                    'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                  }`} style={{ maxWidth: '100%' }}>
                    {services
                      .slice(slideIndex * cardsPerSlide, (slideIndex + 1) * cardsPerSlide)
                      .map((service) => (
                        <div
                          key={service.id}
                          className="group flex flex-col items-center text-center transition-all duration-300 p-4"
                        >
                          {/* Service Image - No card background */}
                          <div className="mb-4 group-hover:scale-110 transition-all duration-300 group-hover:-translate-y-1">
                            <div className="w-20 h-20 relative overflow-hidden rounded-2xl shadow-md group-hover:shadow-lg transition-shadow duration-300">
                              <Image
                                src={getServiceImage(service)}
                                alt={getServiceImageAlt(service)}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = '/placeholder-property.svg';
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Service Name */}
                          <h3 className="text-sm font-medium text-gray-700 group-hover:text-orange-600 transition-colors duration-300 text-center">
                            {service.service_name}
                          </h3>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex
                      ? 'bg-orange-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
