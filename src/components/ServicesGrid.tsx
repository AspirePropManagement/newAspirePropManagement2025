'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Service } from '@/types/Service';

interface ServicesGridProps {
  services: Service[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
}

/**
 * ServicesGrid component displays services in a card grid layout
 * Matches the design from the services page
 */
export function ServicesGrid({ services, loading = false, title = 'Our Services', subtitle = 'Comprehensive real estate services to help you achieve your property goals with professional expertise.' }: ServicesGridProps) {
  const getServiceImage = (service: Service): string => {
    if (service.image_data) {
      if (service.image_data.startsWith('data:image/')) {
        return service.image_data;
      }
      return service.image_data;
    }
    
    if (service.service_images && service.service_images.length > 0) {
      return service.service_images[0].image_path;
    }
    
    if (service.image_path) {
      return service.image_path;
    }
    
    return '/placeholder-property.svg';
  };

  const getServiceImageAlt = (service: Service): string => {
    if (service.image_alt) {
      return service.image_alt;
    }
    if (service.service_images && service.service_images.length > 0 && service.service_images[0].alt_text) {
      return service.service_images[0].alt_text;
    }
    return service.service_name;
  };

  if (loading) {
    return (
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="py-2 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 md:p-8 border border-gray-100 hover:border-orange-200 group transform hover:-translate-y-1"
            >
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                  {getServiceImage(service) ? (
                    <Image 
                      src={getServiceImage(service)} 
                      alt={getServiceImageAlt(service)} 
                      width={96} 
                      height={96} 
                      className="object-cover w-full h-full rounded-full group-hover:scale-110 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
                  {service.service_name}
                </h3>
                {service.short_description && (
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                    {service.short_description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View More Services Link */}
        <div className="text-center mt-8 sm:mt-10">
          <Link 
            href="/services"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 group"
          >
            <span>View More Services</span>
            <svg 
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
