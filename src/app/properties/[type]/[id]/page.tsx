'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { extractPropertyImages, getImageSrc, isBase64Image } from '@/utils/imageUtils';
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
import { PropertyLayout } from '@/components/PropertyLayout';
import { PropertyAmenities } from '@/components/PropertyAmenities';
import { PropertyImageGallery } from '@/components/PropertyImageGallery';
import { FloorPlanViewer } from '@/components/FloorPlanViewer';
import { VirtualTourSection } from '@/components/VirtualTourSection';
import { ShareButton } from '@/components/ShareButton';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ToastContainer';
import { PropertyEnquiryForm } from '@/components/PropertyEnquiryForm';
import { useNewProjects } from '@/hooks/useNewProjects';
import { RecommendedPropertiesCarousel } from '@/components/RecommendedPropertiesCarousel';
import { ScrollArrow } from '@/components/ScrollArrow';

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
  // Hooks for functionality
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  const { type, id } = params;
  const { projects: recommendedProjects } = useNewProjects();

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
    if (!price) return '';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lacs`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  // Get property images - now supports both URL and base64
  const getPropertyImages = () => {
    return extractPropertyImages(property);
  };

  // Get property details for PropertyDetails component
  const getPropertyDetails = () => {
    if (!property) return null;
    
    // Get price based on property type
    let price = 0;
    if (type === 'resale') {
      price = property.asking_price || 0;
    } else if (type === 'rental') {
      price = property.rent_amount || 0;
    } else if (type === 'new_project') {
      price = property.min_price || property.starting_price || 0;
    }
    
    return {
      title: getPropertyTitle(),
      price: price,
      location: property.location || property.project_location || 'Location not specified',
      bhkType: getBHKConfig(),
      carpetArea: property.carpet_area || property.square_feet || 0,
      squareFeet: property.square_feet || property.carpet_area || 0,
      propertyType: property.property_type || property.project_type || 'Property',
      status: property.status || 'Available',
      description: property.description || property.notes || property.other_notes || 'No description available',
      id: property.id,
      type: type as string
    };
  };

  // Get property specifications
  const getPropertySpecifications = () => {
    if (!property) return {};
    
    const specs: Record<string, any> = {};
    
    // Basic specifications
    if (property.furnishing_type) specs['Furnishing'] = property.furnishing_type.replace('_', ' ');
    if (property.parking_type) specs['Parking'] = property.parking_type.replace('_', ' ');
    if (property.facing) specs['Facing'] = property.facing;
    if (property.floor_no) specs['Floor'] = property.floor_no;
    if (property.wing_no) specs['Wing'] = property.wing_no;
    if (property.flat_no) specs['Flat No'] = property.flat_no;
    if (property.property_age) specs['Property Age'] = property.property_age;
    if (property.is_negotiable !== undefined) specs['Negotiable'] = property.is_negotiable;
    if (property.has_amenities !== undefined) specs['Amenities Available'] = property.has_amenities;
    if (property.listed_by) specs['Listed By'] = property.listed_by;
    if (property.ownership_type) specs['Ownership'] = property.ownership_type;
    if (property.rera_id) specs['RERA ID'] = property.rera_id;
    if (property.flats_per_floor) specs['Flats per Floor'] = property.flats_per_floor;
    if (property.society_area_size) specs['Society Area Size'] = property.society_area_size;
    if (property.reason_for_sale) specs['Reason for Sale'] = property.reason_for_sale;
    if (typeof property.loan_on_property === 'boolean') {
      const loanSummary = property.loan_on_property
        ? `Yes${property.loan_amount ? `, ₹${Number(property.loan_amount).toLocaleString()}` : ''}${property.bank_name ? `, ${property.bank_name}` : ''}`
        : 'No';
      specs['Loan on Property'] = loanSummary;
    }
    if (property.visit_days_weekend) specs['Visit Days (Weekend)'] = property.visit_days_weekend;
    if (property.visit_timing_weekend) specs['Visit Timing (Weekend)'] = property.visit_timing_weekend;
    if (property.visit_days_weekdays) specs['Visit Days (Weekdays)'] = property.visit_days_weekdays;
    if (property.visit_timing_weekdays) specs['Visit Timing (Weekdays)'] = property.visit_timing_weekdays;
    
    // Rental specific
    if (property.type === 'rental') {
      if (property.deposit_amount) specs['Deposit'] = `₹${property.deposit_amount.toLocaleString()}`;
      if (property.allowed_for_family !== undefined) specs['Family Allowed'] = property.allowed_for_family;
      if (property.allowed_for_bachelor !== undefined) specs['Bachelor Allowed'] = property.allowed_for_bachelor;
      if (property.pets_allowed !== undefined) specs['Pets Allowed'] = property.pets_allowed;
      if (property.immediate_possession !== undefined) specs['Immediate Possession'] = property.immediate_possession;
    }
    
    // New project specific
    if (property.type === 'new_project') {
      if (property.total_units) specs['Total Units'] = property.total_units;
      if (property.available_units) specs['Available Units'] = property.available_units;
      if (property.possession_date) specs['Possession Date'] = property.possession_date;
      if (property.rera_number) specs['RERA Number'] = property.rera_number;
      if (property.project_status) specs['Project Status'] = property.project_status.replace('_', ' ');
    }
    
    return specs;
  };

  // Get property amenities
  const getPropertyAmenities = () => {
    if (!property || !property.amenities) return [];
    
    // If amenities is an array, return it
    if (Array.isArray(property.amenities)) {
      return property.amenities;
    }
    
    // If amenities is an object, extract the values
    if (typeof property.amenities === 'object') {
      const amenityList: string[] = [];
      
      // Extract from basic_amenities
      if (property.amenities.basic_amenities) {
        Object.entries(property.amenities.basic_amenities).forEach(([key, value]) => {
          if (value) {
            amenityList.push(key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
          }
        });
      }
      
      // Extract from luxury_amenities
      if (property.amenities.luxury_amenities) {
        Object.entries(property.amenities.luxury_amenities).forEach(([key, value]) => {
          if (value) {
            amenityList.push(key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
          }
        });
      }
      
      return amenityList;
    }
    
    return [];
  };

  // Handle call now functionality
  const handleCallNow = () => {
    // Use the specific phone number provided
    const contactNumber = '+919226254182';
    const telUrl = `tel:${contactNumber}`;
    
    // Open phone dialer
    window.open(telUrl, '_self');
    showSuccess('Opening phone dialer...');
  };


  // Get property data for sharing
  const getPropertyData = () => {
    if (!property) return null;
    
    return {
      title: getPropertyTitle(),
      location: property.location || 'Location not specified',
      price: property.asking_price || property.rent_amount || property.starting_price || 0,
      bhkType: getBHKConfig(),
      carpetArea: property.carpet_area || property.square_feet || 0,
      propertyType: property.property_type || 'Property',
      id: property.id,
      type: property.type
    };
  };

  // Get property title
  const getPropertyTitle = () => {
    if (!property) return '';
    
    if (type === 'resale') {
      return property.society_name || property.title || 'Resale Property';
    } else if (type === 'rental') {
      return property.society_name || property.title || 'Rental Property';
    } else if (type === 'new_project') {
      return property.project_name || property.title || 'New Project';
    }
    return property.title || 'Property';
  };

  // Get property price
  const getPropertyPrice = () => {
    if (!property) return '';
    
    if (type === 'resale') {
      return formatPrice(property.asking_price);
    } else if (type === 'rental') {
      return `${formatPrice(property.rent_amount)}/month`;
    } else if (type === 'new_project') {
      return formatPrice(property.min_price || property.starting_price);
    }
    return '';
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
    return bhkMap[property.bhk_type] || property.bhk_type || 'BHK not specified';
  };

  // Get property type label
  const getPropertyTypeLabel = () => {
    if (!property) return 'Property';
    
    switch (type) {
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-sm sm:text-base text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <HomeIcon className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm sm:text-base w-full sm:w-auto"
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleFavoriteToggle}
                className="flex items-center px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
              >
                {isFavorite ? (
                  <HeartIconSolid className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2 text-gray-600" />
                )}
                <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
              
               {property && (
                 <ShareButton
                   property={getPropertyData()!}
                   variant="default"
                   size="md"
                 />
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Property Images */}
          <div className="space-y-3 sm:space-y-4 lg:col-span-2">
            <div className="relative h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
              {images.length > 0 ? (
                <Image
                  src={getImageSrc(images[currentImageIndex])}
                  alt={getPropertyTitle()}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/api/placeholder/600/400';
                  }}
                  // For base64 images, we don't need to configure domains
                  unoptimized={isBase64Image(images[currentImageIndex])}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200">
                  <HomeIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-3 sm:mb-4" />
                  <span className="text-base sm:text-lg text-gray-500">No Images Available</span>
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {images.slice(0, 8).map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative h-16 sm:h-20 bg-gray-200 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-orange-500' : ''
                    }`}
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                      // For base64 images, we don't need to configure domains
                      unoptimized={isBase64Image(image)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Overview (moved below images) */}
            <div className="space-y-4 sm:space-y-6">
              {/* Property Type Badge */}
              <div>
                <span className="bg-orange-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium">
                  {getPropertyTypeLabel()}
                </span>
              </div>

              {/* Property Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                {getPropertyTitle()}
              </h1>

              {/* Location */}
              <div className="flex items-start text-gray-600">
                <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm sm:text-base md:text-lg">{property.location || 'Location not specified'}</span>
              </div>

              {/* Price */}
              {getPropertyPrice() && (
                <div className="flex items-center">
                  <CurrencyRupeeIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-500 mr-2" />
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    {getPropertyPrice()}
                  </span>
                </div>
              )}

              {/* Meta: Type + ID */}
              <div className="text-xs text-gray-500">
                <span>Type: {getPropertyTypeLabel()}</span>
                <span className="mx-2">•</span>
                <span>ID: {property.id}</span>
              </div>

              {/* Configuration */}
              <div className="flex flex-wrap items-center text-gray-600 gap-2">
                <div className="flex items-center">
                  <HomeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  <span className="text-sm sm:text-base md:text-lg">{getBHKConfig()}</span>
                </div>
                {property.carpet_area && (
                  <span className="text-sm sm:text-base">• {property.carpet_area} sq.ft</span>
                )}
              </div>

              {/* Contact Button */}
              <div className="flex justify-center">
                <button 
                  onClick={handleCallNow}
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base w-full sm:w-auto"
                >
                  <PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Call Now
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{images.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{getPropertyAmenities().length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Amenities</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right-side Enquiry Form */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 self-start">
            <PropertyEnquiryForm 
              propertyTitle={getPropertyTitle()} 
              propertyId={property.id}
              propertyType={property.type}
              propertyPrice={getPropertyPrice()}
              propertyLocation={property.location || 'Location not specified'}
            />
          </div>
        </div>
      </div>

      {/* Comprehensive Property Layout */}
      <PropertyLayout
        propertyImages={{
          general_photos: property.property_images?.general_photos || {},
          floor_plans: property.property_images?.floor_plans || {},
          project_images: property.property_images?.project_images || {},
          legal_docs: property.property_images?.legal_docs || {},
          virtual_content: property.property_images?.virtual_content || {}
        }}
        propertyDetails={getPropertyDetails() || {
          title: 'Property',
          price: 0,
          location: 'Location not specified',
          bhkType: 'BHK not specified',
          carpetArea: 0,
          squareFeet: 0,
          propertyType: 'Property',
          status: 'Available',
          description: 'No description available'
        }}
        amenities={getPropertyAmenities()}
        specifications={getPropertySpecifications()}
      />

      {/* Recommended Properties */}
      <RecommendedPropertiesCarousel projects={recommendedProjects} />

      {/* Removed bottom enquiry form to avoid duplication on detail page */}

      {/* Scroll Arrow */}
      <ScrollArrow />

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
