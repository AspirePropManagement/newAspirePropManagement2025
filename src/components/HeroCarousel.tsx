'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { HeroCarouselImage } from '../types/HeroCarousel';
import { HeroCarouselSkeleton } from './skeletons';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

/**
 * TypewriterText component for animated text display
 * Creates a typewriter effect by gradually revealing characters
 */
interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  resetTrigger?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  className = '', 
  delay = 0, 
  speed = 50,
  resetTrigger = 0
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset animation when resetTrigger changes (image changes)
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [resetTrigger]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayedText('');
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [delay]);

  return (
    <span className={className}>
      {displayedText}
    </span>
  );
};

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

  // Auto-rotate carousel every 10 seconds (slower for better viewing)
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Changed from 5000ms to 10000ms (10 seconds)

    return () => clearInterval(interval);
  }, [images.length]);

  const fetchCarouselImages = async () => {
    try {
      setLoading(true);
      
      if (!supabase) {
        setError('Database connection not available');
        setLoading(false);
        return;
      }

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
    return <HeroCarouselSkeleton />;
  }

  if (error || images.length === 0) {
    return (
      <div className="relative h-[100dvh] md:h-[100vh] bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
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
    <div 
      className="relative h-[100dvh] md:h-[100vh] overflow-clip hero-no-scroll bg-gray-900 z-10 w-full" 
      style={{ 
        zIndex: 10, 
        overscrollBehavior: 'none',
        overflow: 'clip',
        position: 'relative',
        maxHeight: '100dvh'
      }}
    >
      {/* Carousel Images */}
      <div className="relative h-full overflow-clip hero-no-scroll" style={{ overflow: 'clip' }}>
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.image_data}
              alt={image.alt_text || image.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            
            {/* Image Overlay with Content */}
            <div 
              className="absolute inset-0 flex items-center overflow-clip hero-no-scroll"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
                overflow: 'clip'
              }}
            >
              <div 
                className="text-left text-white flex flex-col justify-center sm:px-6 md:px-8 pr-10 sm:pr-12 max-w-[100vw] md:max-w-2xl ml-4 sm:ml-8 md:ml-20 lg:ml-24"
                style={{ overflow: 'clip', maxHeight: '80vh' }}
              >
                <div 
                  className="mb-6 overflow-clip"
                  style={{ 
                    minHeight: '3rem',
                    maxHeight: '10rem',
                    overflow: 'clip'
                  }}
                >
                  <TypewriterText 
                    text={image.title || "Discover Your Next Journey"}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold block break-words leading-tight"
                    resetTrigger={currentIndex}
                  />
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

      
    </div>
  );
};
