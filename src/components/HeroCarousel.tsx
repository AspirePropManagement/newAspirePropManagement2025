'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { HeroCarouselImage } from '../types/HeroCarousel';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * Hero Carousel component for the landing page
 * Displays uploaded images in a rotating carousel format with mouse animation and filter card
 */
export const HeroCarousel: React.FC = () => {
  const [images, setImages] = useState<HeroCarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch active carousel images
  useEffect(() => {
    fetchCarouselImages();
  }, []);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const fetchCarouselImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hero_carousel_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error('Error fetching carousel images:', err);
      setError('Failed to load carousel images');
    } finally {
      setLoading(false);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading carousel...</p>
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Aspire Property Management</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in premium property management and real estate services.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900">
      {/* Carousel Images */}
      <div className="relative h-full">
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.image_data}
              alt={image.alt_text || image.title}
              className="w-full h-full object-cover"
            />
            
            {/* Image Overlay with Content */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-6 max-w-4xl">
                <h1 className="text-5xl font-bold mb-4">
                  {image.title}
                </h1>
                {image.description && (
                  <p className="text-xl mb-8 text-gray-200">
                    {image.description}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/properties">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                      Explore Properties
                    </button>
                  </Link>
                  <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-orange-500 scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20">
          <div 
            className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
            style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
          />
        </div>
      )}

      {/* Mouse Animation */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg 
            className="w-6 h-6 text-white opacity-70" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </div>
      </div>

      {/* Filter Card Component */}
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Property</h2>
              <p className="text-gray-600">Search from thousands of properties across the city</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Budget Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Budget</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Select Budget</option>
                  <option value="under-40">Under 40 Lacs</option>
                  <option value="40-70">40 Lacs - 70 Lacs</option>
                  <option value="70-1cr">70 Lacs - 1 Crore</option>
                  <option value="1-2cr">1 Crore - 2 Crore</option>
                  <option value="above-2cr">Above 2 Crore</option>
                </select>
              </div>

              {/* Property Type Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Select Type</option>
                  <option value="1bhk">1 BHK</option>
                  <option value="2bhk">2 BHK</option>
                  <option value="3bhk">3 BHK</option>
                  <option value="4bhk">4 BHK</option>
                  <option value="4plus">4+ BHK</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Select Location</option>
                  <option value="hinjawadi">Hinjawadi</option>
                  <option value="koregaon-park">Koregaon Park</option>
                  <option value="kharadi">Kharadi</option>
                  <option value="baner">Baner</option>
                  <option value="wakad">Wakad</option>
                </select>
              </div>

              {/* Possession Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Possession</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Select Possession</option>
                  <option value="ready">Ready to Move</option>
                  <option value="1year">In 1 Year</option>
                  <option value="2year">In 2 Years</option>
                  <option value="3year">In 3 Years</option>
                </select>
              </div>
            </div>

            <div className="text-center">
              <Link href="/properties-listing">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg">
                  Find Properties
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
