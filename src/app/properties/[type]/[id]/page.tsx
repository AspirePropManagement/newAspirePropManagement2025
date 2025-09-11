'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  MapPinIcon, 
  HomeIcon, 
  CurrencyRupeeIcon,
  HeartIcon,
  StarIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface PropertyDetailPageProps {}

/**
 * Property Detail Page
 * Displays detailed information about a specific property
 */
export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { type, id } = params;

  // Check if property is in favorites on component mount
  useEffect(() => {
    if (property?.id) {
      const favorites = localStorage.getItem('favoriteProperties');
      const favoriteIds = favorites ? JSON.parse(favorites) : [];
      const isInFavorites = favoriteIds.includes(property.id);
      setIsFavorite(isInFavorites);
    }
  }, [property?.id]);

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties/${type}/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Property not found');
          } else {
            setError('Failed to load property details');
          }
          return;
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    if (type && id) {
      fetchProperty();
    }
  }, [type, id]);

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (!property?.id) return;

    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favoriteIds.filter((favId: string) => favId !== property.id);
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

  // Format price for display
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

  // Get property images
  const getPropertyImages = () => {
    if (!property) return [];
    
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
    
    return images.length > 0 ? images : [];
  };

  // Get property title
  const getPropertyTitle = () => {
    if (!property) return '';
    
    if (property.type === 'resale') {
      return property.title || property.society_name || 'Resale Property';
    } else if (property.type === 'rental') {
      return property.title || property.society_name || 'Rental Property';
    } else if (property.type === 'new_project') {
      return property.title || property.project_name || 'New Project';
    }
    return property.title || 'Property';
  };

  // Get property price
  const getPropertyPrice = () => {
    if (!property) return 'Price on request';
    
    if (property.type === 'resale') {
      return formatPrice(property.asking_price);
    } else if (property.type === 'rental') {
      return `${formatPrice(property.rent_amount)}/month`;
    } else if (property.type === 'new_project') {
      return formatPrice(property.starting_price);
    }
    return 'Price on request';
  };

  // Get BHK configuration
  const getBHKConfig = () => {
    if (!property?.bhk_type) return 'BHK not specified';
    
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

  // Get property type label
  const getPropertyTypeLabel = () => {
    if (!property) return 'Property';
    
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HomeIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = getPropertyImages();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavoriteToggle}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isFavorite ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500 mr-2" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-gray-600 mr-2" />
                )}
                {isFavorite ? 'Saved' : 'Save'}
              </button>
              
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <ShareIcon className="w-5 h-5 text-gray-600 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Images */}
          <div className="space-y-4">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={getPropertyTitle()}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/600/400';
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                  <HomeIcon className="w-16 h-16 text-gray-400 mb-4" />
                  <span className="text-lg text-gray-500">No Images Available</span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 8).map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-20 bg-gray-200 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            {/* Property Type Badge */}
            <div>
              <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                {getPropertyTypeLabel()}
              </span>
            </div>

            {/* Property Title */}
            <h1 className="text-3xl font-bold text-gray-900">
              {getPropertyTitle()}
            </h1>

            {/* Location */}
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="w-5 h-5 mr-2" />
              <span className="text-lg">{property.location || 'Location not specified'}</span>
            </div>

            {/* Price */}
            <div className="flex items-center">
              <CurrencyRupeeIcon className="w-8 h-8 text-orange-500 mr-2" />
              <span className="text-4xl font-bold text-gray-900">
                {getPropertyPrice()}
              </span>
            </div>

            {/* Configuration */}
            <div className="flex items-center text-gray-600">
              <HomeIcon className="w-5 h-5 mr-2" />
              <span className="text-lg">{getBHKConfig()}</span>
              {property.carpet_area && (
                <span className="ml-4">• {property.carpet_area} sq.ft</span>
              )}
            </div>

            {/* Contact Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center">
                <PhoneIcon className="w-5 h-5 mr-2" />
                Call Now
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center">
                <EnvelopeIcon className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </div>

            {/* Property Description */}
            {property.description && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            )}

            {/* Additional Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Property Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.furnishing_type && (
                  <div>
                    <span className="text-sm text-gray-500">Furnishing</span>
                    <p className="font-medium">{property.furnishing_type.replace('_', ' ')}</p>
                  </div>
                )}
                {property.parking_type && (
                  <div>
                    <span className="text-sm text-gray-500">Parking</span>
                    <p className="font-medium">{property.parking_type.replace('_', ' ')}</p>
                  </div>
                )}
                {property.property_type && (
                  <div>
                    <span className="text-sm text-gray-500">Property Type</span>
                    <p className="font-medium">{property.property_type.replace('_', ' ')}</p>
                  </div>
                )}
                {property.age_of_property && (
                  <div>
                    <span className="text-sm text-gray-500">Age</span>
                    <p className="font-medium">{property.age_of_property}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
