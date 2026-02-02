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
      return formatPrice(property.min_price);
    }
    return 'Price on request';
  };

  /**
   * Gets BHK configuration
   */
  const getBHKConfig = () => {
    if (property.type === 'new_project') {
      // For new projects, show available BHK types or project type
      if (property.available_bhk_types && property.available_bhk_types.length > 0) {
        const bhkMap: { [key: string]: string } = {
          '1_rk': '1 RK',
          '1_bhk': '1 BHK',
          '2_bhk': '2 BHK',
          '3_bhk': '3 BHK',
          '4_bhk': '4 BHK',
          '5_bhk': '5 BHK',
          '5_plus_bhk': '5+ BHK'
        };
        return property.available_bhk_types.map((bhk: string) => bhkMap[bhk] || bhk.replace('_', ' ').toUpperCase()).join(', ');
      }
      return property.project_type?.replace('_', ' ').toUpperCase() || 'Project';
    }
    
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
    const price = property.asking_price || property.rent_amount || property.min_price;
    const area = property.carpet_area || property.square_feet;
    
    if (price && area && area > 0) {
      const pricePerSqFt = price / area;
      return `₹${Math.round(pricePerSqFt).toLocaleString()}/sq.ft`;
    }
    return '';
  };

  const images = getPropertyImages();

  // Auto-rotate carousel if multiple images
  React.useEffect(() => {
    if (!images || images.length <= 1) {
      setImageIndex(0);
      return;
    }
    
    // Reset to first image when images change
    setImageIndex(0);
    
    const id = setInterval(() => {
      setImageError(false);
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Auto-scroll every 3 seconds
    
    return () => clearInterval(id);
  }, [images]);

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer relative">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
      
      {/* Property Image */}
      <div className="relative h-40 sm:h-48 md:h-52 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
            <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-500">
              <HomeIcon className="w-9 h-9 text-white" />
            </div>
            <span className="text-gray-500 text-sm font-medium">No Image Available</span>
          </div>
        )}

        {/* Image Navigation - removed per request */}
        {/* (left/right buttons deleted) */}

        {/* Property Type Badge / RERA Approved Badge for New Projects */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
          {property.type === 'new_project' ? (
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg group-hover:scale-105 transition-transform duration-300 flex items-center">
              <CheckBadgeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
              RERA Approved
            </span>
          ) : (
            <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg group-hover:scale-105 transition-transform duration-300">
              {getPropertyTypeLabel()}
            </span>
          )}
        </div>


        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteToggle();
          }}
          className="absolute top-2 sm:top-3 right-2 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg z-20"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-red-500 transition-colors" />
          )}
        </button>

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1.5 max-w-[calc(100%-2rem)]">
            <div 
              ref={dotsContainerRef}
              className="flex space-x-1.5 overflow-x-auto scrollbar-hide max-w-full"
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-125 flex-shrink-0 ${
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
      <div className="p-3 sm:p-4 md:p-5 relative z-10">
        {/* Verified Badge then Title below it */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          {/* Verified Badge */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-semibold flex items-center shadow-md group-hover:scale-105 transition-transform duration-300">
            <CheckBadgeIcon className="w-3 h-3 mr-1 text-white" />
            <span>100% Verified</span>
          </div>
          {/* Price per sq ft small on right (optional) */}
          {getPricePerSqFt() && (
            <span className="text-[10px] sm:text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{getPricePerSqFt()}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors duration-300 mb-2">
          {getPropertyTitle()}
        </h3>

        {/* Configuration above Address */}
        <div className="flex items-center text-gray-900 text-xs sm:text-sm mb-2 group-hover:text-gray-900 transition-colors duration-300">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-purple-200 transition-colors duration-300 flex-shrink-0">
            <HomeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
          </div>
          <span className="font-medium">{getBHKConfig()}</span>
          {property.carpet_area && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-lg text-[10px] sm:text-xs font-medium">{property.carpet_area} sq.ft</span>
          )}
        </div>

        {/* Address below configuration */}
        <div className="flex items-center text-gray-600 text-[11px] sm:text-xs mb-3 group-hover:text-gray-800 transition-colors duration-300">
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
            <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600" />
          </div>
          <span className="line-clamp-1 font-medium">{getPropertyLocation()}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center mr-2 group-hover:bg-orange-200 transition-colors duration-300 flex-shrink-0">
              <CurrencyRupeeIcon className="w-3.5 h-3.5 text-orange-600" />
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
              {getPropertyPrice()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Link 
          href={`/properties/${property.type}/${property.id}`}
          onClick={(e) => e.stopPropagation()}
          className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-center py-2 sm:py-2.5 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group-hover:scale-105"
        >
          <div className="flex items-center justify-center">
            <span>View Details</span>
            <svg className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
