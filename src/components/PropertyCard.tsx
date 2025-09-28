'use client'

import React from 'react';
import Image from 'next/image';
import { 
  MapPinIcon, 
  HomeIcon, 
  CurrencyRupeeIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, CheckBadgeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { extractPropertyImages, getImageSrc, isBase64Image, isImageUrl } from '@/utils/imageUtils';

interface PropertyCardProps {
  property: any;
}

/**
 * PropertyCard component for displaying property information in the listing page
 * Similar to PropertyPistol's property card design
 */
export function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [imageIndex, setImageIndex] = React.useState(0);
  const [imageError, setImageError] = React.useState(false);
  const dotsContainerRef = React.useRef<HTMLDivElement>(null);

  // Check if property is in favorites on component mount
  React.useEffect(() => {
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    const isInFavorites = favoriteIds.includes(property.id);
    setIsFavorite(isInFavorites);
  }, [property.id]);

  // Auto-scroll to active dot when image index changes
  React.useEffect(() => {
    if (dotsContainerRef.current && getPropertyImages().length > 1) {
      const container = dotsContainerRef.current;
      const activeDot = container.children[imageIndex] as HTMLElement;
      
      if (activeDot) {
        const containerWidth = container.offsetWidth;
        const dotLeft = activeDot.offsetLeft;
        const dotWidth = activeDot.offsetWidth;
        const scrollLeft = container.scrollLeft;
        
        // Check if dot is outside visible area
        if (dotLeft < scrollLeft) {
          // Dot is to the left of visible area
          container.scrollTo({
            left: dotLeft - 20, // Add some padding
            behavior: 'smooth'
          });
        } else if (dotLeft + dotWidth > scrollLeft + containerWidth) {
          // Dot is to the right of visible area
          container.scrollTo({
            left: dotLeft + dotWidth - containerWidth + 20, // Add some padding
            behavior: 'smooth'
          });
        }
      }
    }
  }, [imageIndex]);

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favoriteIds.filter((id: number) => id !== property.id);
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
    } else {
      // Add to favorites
      const updatedFavorites = [...favoriteIds, property.id];
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
    }
    
    setIsFavorite(!isFavorite);
    
    // Dispatch custom event to update navbar count
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

  /**
   * Formats price for display
   */
  const formatPrice = (price: number) => {
    if (!price) return 'Price on request';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lacs`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  /**
   * Gets property images for carousel
   * Now supports both URL and base64 images
   */
  const getPropertyImages = () => {
    return extractPropertyImages(property);
  };

  /**
   * Gets property title based on type
   */
  const getPropertyTitle = () => {
    if (property.type === 'resale') {
      return property.title || property.society_name || 'Resale Property';
    } else if (property.type === 'rental') {
      return property.title || property.society_name || 'Rental Property';
    } else if (property.type === 'new_project') {
      return property.title || property.project_name || 'New Project';
    }
    return property.title || 'Property';
  };

  /**
   * Gets property location
   */
  const getPropertyLocation = () => {
    return property.location || 'Location not specified';
  };

  /**
   * Gets property price
   */
  const getPropertyPrice = () => {
    if (property.type === 'resale') {
      return formatPrice(property.asking_price);
    } else if (property.type === 'rental') {
      return `${formatPrice(property.rent_amount)}/month`;
    } else if (property.type === 'new_project') {
      return formatPrice(property.starting_price);
    }
    return 'Price on request';
  };

  /**
   * Gets BHK configuration
   */
  const getBHKConfig = () => {
    const bhkMap: { [key: string]: string } = {
      '1_rk': '1 RK',
      '1_bhk': '1 BHK',
      '2_bhk': '2 BHK',
      '3_bhk': '3 BHK',
      '4_bhk': '4 BHK',
      '5_bhk': '5 BHK',
      '5_plus_bhk': '5+ BHK'
    };
    return bhkMap[property.bhk_type] || 'BHK not specified';
  };

  /**
   * Gets property type label
   */
  const getPropertyTypeLabel = () => {
    switch (property.type) {
      case 'resale':
        return 'For Sale';
      case 'rental':
        return 'For Rent';
      case 'new_project':
        return 'New Project';
      default:
        return 'Property';
    }
  };

  /**
   * Gets price per sq ft
   */
  const getPricePerSqFt = () => {
    const price = property.asking_price || property.rent_amount || property.starting_price;
    const area = property.carpet_area || property.square_feet;
    
    if (price && area) {
      const pricePerSqFt = price / area;
      return `₹${Math.round(pricePerSqFt).toLocaleString()}/sq.ft`;
    }
    return '';
  };

  const images = getPropertyImages();

  return (
    <div className="group bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
      
      {/* Property Image */}
      <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {images.length > 0 && !imageError ? (
          <Image
            src={getImageSrc(images[imageIndex])}
            alt={getPropertyTitle()}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            onError={() => {
              setImageError(true);
            }}
            unoptimized={isBase64Image(images[imageIndex])}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <HomeIcon className="w-10 h-10 text-white" />
            </div>
            <span className="text-gray-500 font-medium">No Image Available</span>
          </div>
        )}

        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImageError(false);
                setImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-xl"
              title="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImageError(false);
                setImageIndex(prev => (prev + 1) % images.length);
              }}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-xl"
              title="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm px-4 py-2 rounded-full font-semibold shadow-lg group-hover:scale-105 transition-transform duration-300">
            {getPropertyTypeLabel()}
          </span>
        </div>


        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-20"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-6 h-6 text-red-500" />
          ) : (
            <HeartIcon className="w-6 h-6 text-gray-600 hover:text-red-500 transition-colors" />
          )}
        </button>

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-sm rounded-full px-3 py-2 max-w-[calc(100%-2rem)]">
            <div 
              ref={dotsContainerRef}
              className="flex space-x-2 overflow-x-auto scrollbar-hide max-w-full"
            >
              {images.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setImageError(false);
                    setImageIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 hover:scale-125 flex-shrink-0 ${
                    index === imageIndex 
                      ? 'bg-white shadow-md scale-110' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                  title={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6 relative z-10">
        {/* Property Title */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300 flex-1 mr-3">
            {getPropertyTitle()}
          </h3>
          
          {/* Verified Badge */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <CheckBadgeIcon className="w-3.5 h-3.5 mr-1 text-white" />
            100% Verified
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
          <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-blue-200 transition-colors duration-300">
            <MapPinIcon className="w-3 h-3 text-blue-600" />
          </div>
          <span className="line-clamp-1 font-medium">{getPropertyLocation()}</span>
        </div>

        {/* Configuration */}
        <div className="flex items-center text-gray-600 text-sm mb-4 group-hover:text-gray-800 transition-colors duration-300">
          <div className="w-5 h-5 bg-purple-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-purple-200 transition-colors duration-300">
            <HomeIcon className="w-3 h-3 text-purple-600" />
          </div>
          <span className="font-medium">{getBHKConfig()}</span>
          {property.carpet_area && (
            <span className="ml-2 px-2 py-1 bg-gray-100 rounded-lg text-xs font-medium">
              {property.carpet_area} sq.ft
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-orange-200 transition-colors duration-300">
              <CurrencyRupeeIcon className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
              {getPropertyPrice()}
            </span>
          </div>
          {getPricePerSqFt() && (
            <div className="text-right">
              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {getPricePerSqFt()}
              </span>
            </div>
          )}
        </div>


        {/* Action Button */}
        <Link 
          href={`/properties/${property.type}/${property.id}`}
          onClick={(e) => e.stopPropagation()}
          className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center py-4 px-6 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group-hover:scale-105"
        >
          <div className="flex items-center justify-center">
            <span>View Details</span>
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
