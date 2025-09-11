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
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

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

  // Check if property is in favorites on component mount
  React.useEffect(() => {
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    const isInFavorites = favoriteIds.includes(property.id);
    setIsFavorite(isInFavorites);
  }, [property.id]);

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
   */
  const getPropertyImages = () => {
    const images: string[] = [];
    
    // First, try to use the direct images array
    if (property.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images.filter((img: any) => img && typeof img === 'string' && img.trim() !== '');
    }
    
    // Then try to extract images from the property_images JSONB structure
    if (property.property_images && typeof property.property_images === 'object') {
      // Check general_photos
      if (property.property_images.general_photos) {
        if (property.property_images.general_photos.exterior && Array.isArray(property.property_images.general_photos.exterior)) {
          images.push(...property.property_images.general_photos.exterior.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.general_photos.interior && Array.isArray(property.property_images.general_photos.interior)) {
          images.push(...property.property_images.general_photos.interior.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.general_photos.bedrooms && Array.isArray(property.property_images.general_photos.bedrooms)) {
          images.push(...property.property_images.general_photos.bedrooms.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.general_photos.kitchen && Array.isArray(property.property_images.general_photos.kitchen)) {
          images.push(...property.property_images.general_photos.kitchen.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.general_photos.bathrooms && Array.isArray(property.property_images.general_photos.bathrooms)) {
          images.push(...property.property_images.general_photos.bathrooms.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.general_photos.amenities && Array.isArray(property.property_images.general_photos.amenities)) {
          images.push(...property.property_images.general_photos.amenities.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
      }
      
      // Check floor_plans
      if (property.property_images.floor_plans) {
        if (property.property_images.floor_plans.floor_plan && Array.isArray(property.property_images.floor_plans.floor_plan)) {
          images.push(...property.property_images.floor_plans.floor_plan.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.floor_plans.site_plan && Array.isArray(property.property_images.floor_plans.site_plan)) {
          images.push(...property.property_images.floor_plans.site_plan.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.floor_plans.blueprint && Array.isArray(property.property_images.floor_plans.blueprint)) {
          images.push(...property.property_images.floor_plans.blueprint.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
        if (property.property_images.floor_plans.elevation && Array.isArray(property.property_images.floor_plans.elevation)) {
          images.push(...property.property_images.floor_plans.elevation.filter((img: any) => img && typeof img === 'string' && img.trim() !== ''));
        }
      }
    }
    
    // Return images if we found any, otherwise return empty array
    return images.length > 0 ? images : [];
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
      '1_rk_1_bhk': '1 RK/1 BHK',
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
    <Link href={`/properties/${property.type}/${property.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {images.length > 0 ? (
          <Image
            src={images[imageIndex]}
            alt={getPropertyTitle()}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/api/placeholder/400/300';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
            <HomeIcon className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">No Image Available</span>
          </div>
        )}

        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
              }}
              className="w-8 h-8 bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-200 shadow-lg"
              title="Previous image"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setImageIndex(prev => (prev + 1) % images.length);
              }}
              className="w-8 h-8 bg-black bg-opacity-60 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-200 shadow-lg"
              title="Next image"
            >
              ›
            </button>
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
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
          className="absolute top-3 right-3 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all z-10"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1 bg-black bg-opacity-30 rounded-full px-2 py-1">
            {images.map((_: any, index: number) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 hover:scale-125 ${
                  index === imageIndex 
                    ? 'bg-white shadow-md' 
                    : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                }`}
                title={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        {/* Property Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {getPropertyTitle()}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPinIcon className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{getPropertyLocation()}</span>
        </div>

        {/* Configuration */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <HomeIcon className="w-4 h-4 mr-1" />
          <span>{getBHKConfig()}</span>
          {property.carpet_area && (
            <span className="ml-2">• {property.carpet_area} sq.ft</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <CurrencyRupeeIcon className="w-5 h-5 text-orange-500 mr-1" />
            <span className="text-xl font-bold text-gray-900">
              {getPropertyPrice()}
            </span>
          </div>
          {getPricePerSqFt() && (
            <span className="text-sm text-gray-600">
              {getPricePerSqFt()}
            </span>
          )}
        </div>

        {/* Additional Details */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.furnishing_type && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {property.furnishing_type.replace('_', ' ')}
            </span>
          )}
          {property.parking_type && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {property.parking_type.replace('_', ' ')}
            </span>
          )}
          {property.type === 'rental' && property.immediate_possession && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              Immediate Possession
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link 
            href={`/properties/${property.type}/${property.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
      </div>
    </Link>
  );
}
