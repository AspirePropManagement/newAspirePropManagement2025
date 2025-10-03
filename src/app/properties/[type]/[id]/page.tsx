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
        console.log('Property details fetched:', data);
        console.log('Property images structure:', data.property_images);
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
      '1_rk': '1 RK',
      '1_bhk': '1 BHK',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-white to-blue-50 shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm sm:text-base group"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="hidden sm:inline font-medium">Back</span>
            </button>
            
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleFavoriteToggle}
                className={`flex items-center px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium ${
                  isFavorite 
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 shadow-sm'
                }`}
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

      {/* Hero Property Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {/* Main Property Showcase */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Hero Image */}
            <div className="relative group">
              <div className="relative h-80 sm:h-96 md:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                {images.length > 0 ? (
                  <>
                    <Image
                      src={getImageSrc(images[currentImageIndex])}
                      alt={getPropertyTitle()}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/600/400';
                      }}
                      unoptimized={isBase64Image(images[currentImageIndex])}
                    />
                    {/* Image Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    
                    {/* Property Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                        {getPropertyTypeLabel()}
                      </span>
                    </div>
                    
                    {/* Image Counter */}
                    {images.length > 1 && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
                          {currentImageIndex + 1} / {images.length}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="bg-white/80 backdrop-blur-sm rounded-full p-6 mb-4">
                      <HomeIcon className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400" />
                    </div>
                    <span className="text-lg sm:text-xl text-gray-600 font-medium">No Images Available</span>
                  </div>
                )}
              </div>
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                  </button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {images.slice(0, 8).map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl overflow-hidden transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'ring-4 ring-orange-500 shadow-lg scale-105' 
                        : 'hover:scale-105 shadow-md'
                    }`}
                  >
                    <Image
                      src={getImageSrc(image)}
                      alt={`Property image ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={isBase64Image(image)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Property Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info Card */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <HomeIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Property Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">BHK Type</span>
                    <span className="font-semibold text-gray-900">{getBHKConfig()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Carpet Area</span>
                    <span className="font-semibold text-gray-900">{property.carpet_area || 'N/A'} sq.ft</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-semibold text-gray-900">{property.property_type || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CurrencyRupeeIcon className="w-5 h-5 mr-2 text-green-600" />
                  Pricing
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-2xl text-green-600">{getPropertyPrice()}</span>
                  </div>
                  {property.carpet_area && property.asking_price && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Price/sq.ft</span>
                      <span className="font-semibold text-gray-900">
                        ₹{Math.round(property.asking_price / property.carpet_area).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Summary & Enquiry */}
          <div className="lg:col-span-1 space-y-6">
            {/* Property Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {getPropertyTitle()}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPinIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="text-base">{property.location || 'Location not specified'}</span>
                </div>
                
                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{images.length}</div>
                    <div className="text-sm text-gray-600">Photos</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{getPropertyAmenities().length}</div>
                    <div className="text-sm text-gray-600">Amenities</div>
                  </div>
                </div>
              </div>

              {/* Call Now Button */}
              <button 
                onClick={handleCallNow}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <PhoneIcon className="w-5 h-5 mr-3" />
                Call Now
              </button>
            </div>

            {/* Enquiry Form */}
            <div className="sticky top-80">
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
      </div>

      {/* Comprehensive Property Layout */}
      <PropertyLayout
        propertyImages={(() => {
          const images = {
            general_photos: property.property_images?.general_photos || {},
            floor_plans: property.property_images?.floor_plans || {},
            project_images: property.property_images?.project_images || {},
            legal_docs: property.property_images?.legal_docs || {},
            virtual_content: property.property_images?.virtual_content || {}
          };
          console.log('PropertyLayout - Images being passed:', images);
          return images;
        })()}
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
