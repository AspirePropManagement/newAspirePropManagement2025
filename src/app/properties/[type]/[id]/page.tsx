'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPinIcon, 
  HomeIcon, 
  CurrencyRupeeIcon,
  HeartIcon,
  ShareIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  SwatchIcon,
  PhotoIcon,
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { ShareButton } from '@/components/ShareButton';
import { ShareButtonDropdown } from '@/components/ShareButtonDropdown';
import { ShareModal } from '@/components/ShareModal';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ToastContainer';
import { 
  PropertyDetailsSkeleton, 
  PropertyImageGallerySkeleton,
  PropertyAmenitiesSkeleton,
  PropertyContactCardSkeleton
} from '@/components/skeletons';

interface PropertyDetail {
  id: string;
  type: string;
  title: string;
  location: string;
  asking_price?: number;
  rent_amount?: number;
  starting_price?: number;
  price_per_sqft?: number;
  built_up_area?: string;
  carpet_area?: string;
  project_status?: string;
  developer_name?: string;
  seller_name?: string;
  owner_name?: string;
  bhk_type?: string;
  property_type?: string;
  furnishing_type?: string;
  parking_type?: string;
  amenities?: any;
  property_images?: any;
  images?: string[];
  created_at: string;
  offers_available?: boolean;
  status?: string;
  immediate_possession?: boolean;
  available_from_date?: string;
  project_name?: string;
  rera_number?: string;
  // Additional fields for different property types
  seller_email?: string;
  seller_contact_no?: string;
  owner_email?: string;
  owner_contact_no?: string;
  society_name?: string;
  flat_no?: string;
  wing_no?: string;
  floor_no?: string;
  facing?: string;
  property_age?: string;
  is_negotiable?: boolean;
  rent_negotiable?: boolean;
  deposit_amount?: number;
  deposit_negotiable?: boolean;
  allowed_for_family?: boolean;
  allowed_for_bachelor?: boolean;
  allowed_for_anyone?: boolean;
  pets_allowed?: boolean;
  visit_details?: string;
  notes?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { type, id } = params;
  
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  useEffect(() => {
    if (type && id) {
      fetchPropertyDetails();
    }
  }, [type, id]);

  useEffect(() => {
    // Check if property is in favorites
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    setIsFavorite(favoriteIds.includes(id));
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/properties/${type}/${id}`);
      
      if (!response.ok) {
        throw new Error('Property not found');
      }
      
      const rawData = await response.json();
      
      // Transform the raw database data to match the expected format
      const transformedData = transformPropertyData(rawData, type as string);
      setProperty(transformedData);
    } catch (err) {
      console.error('Error fetching property:', err);
      setError('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const transformPropertyData = (prop: any, propertyType: string) => {
    if (propertyType === 'resale') {
      return {
        id: prop.id,
        type: 'resale',
        title: `${prop.bhk_type || ''} ${prop.property_type || ''} - ${prop.society_name || 'Independent'}`.trim(),
        location: prop.location || 'Not specified',
        asking_price: prop.asking_price,
        rent_amount: null,
        starting_price: null,
        price_per_sqft: prop.asking_price && prop.square_feet ? Math.round(prop.asking_price / prop.square_feet) : null,
        built_up_area: prop.square_feet ? `${prop.square_feet} Sq.ft.` : 'On request',
        carpet_area: prop.carpet_area ? `${prop.carpet_area} Sq.ft.` : 'On request',
        project_status: 'ready_to_move',
        developer_name: prop.seller_name || 'Individual Owner',
        seller_name: prop.seller_name,
        owner_name: null,
        bhk_type: prop.bhk_type,
        property_type: prop.property_type,
        furnishing_type: prop.furnishing_type,
        parking_type: prop.parking_type,
        amenities: prop.amenities || {},
        property_images: prop.property_images || {},
        images: prop.property_images?.general_photos?.exterior || [],
        created_at: prop.created_at,
        offers_available: prop.is_negotiable || false,
        status: prop.status || 'available',
        // Additional resale fields
        seller_email: prop.seller_email,
        seller_contact_no: prop.seller_contact_no,
        society_name: prop.society_name,
        flat_no: prop.flat_no,
        wing_no: prop.wing_no,
        floor_no: prop.floor_no,
        facing: prop.facing,
        property_age: prop.property_age,
        is_negotiable: prop.is_negotiable,
        notes: prop.notes
      };
    } else if (propertyType === 'rental') {
      return {
        id: prop.id,
        type: 'rental',
        title: `${prop.bhk_type || ''} ${prop.property_type || ''} - ${prop.society_name || 'Independent'}`.trim(),
        location: prop.location || 'Not specified',
        asking_price: null,
        rent_amount: prop.rent_amount,
        starting_price: null,
        price_per_sqft: null,
        built_up_area: 'On request',
        carpet_area: 'On request',
        project_status: 'ready_to_move',
        developer_name: prop.owner_name || 'Individual Owner',
        seller_name: null,
        owner_name: prop.owner_name,
        bhk_type: prop.bhk_type,
        property_type: prop.property_type,
        furnishing_type: prop.furnishing_type,
        parking_type: prop.parking_type,
        amenities: prop.amenities || {},
        property_images: prop.property_images || {},
        images: prop.property_images?.general_photos?.exterior || [],
        created_at: prop.created_at,
        offers_available: prop.rent_negotiable || false,
        status: prop.status || 'available',
        immediate_possession: prop.immediate_possession,
        available_from_date: prop.available_from_date,
        // Additional rental fields
        owner_email: prop.owner_email,
        owner_contact_no: prop.owner_contact_no,
        society_name: prop.society_name,
        flat_no: prop.flat_no,
        wing_no: prop.wing_no,
        floor_no: prop.floor_no,
        deposit_amount: prop.deposit_amount,
        deposit_negotiable: prop.deposit_negotiable,
        allowed_for_family: prop.allowed_for_family,
        allowed_for_bachelor: prop.allowed_for_bachelor,
        allowed_for_anyone: prop.allowed_for_anyone,
        pets_allowed: prop.pets_allowed,
        visit_details: prop.visit_details,
        rent_negotiable: prop.rent_negotiable,
        notes: prop.notes
      };
    } else if (propertyType === 'new_project') {
      return {
        id: prop.id,
        type: 'new_project',
        title: prop.project_name || `${prop.property_type || 'Property'} Project`,
        location: prop.project_location || prop.location || 'Not specified',
        asking_price: null,
        rent_amount: null,
        starting_price: prop.starting_price,
        price_per_sqft: prop.starting_price && prop.square_feet ? Math.round(prop.starting_price / prop.square_feet) : null,
        built_up_area: prop.square_feet ? `${prop.square_feet} Sq.ft.` : 'On request',
        carpet_area: 'On request',
        project_status: prop.construction_status || 'under_construction',
        developer_name: prop.builder_name || prop.crafted_by || 'Developer',
        seller_name: null,
        owner_name: null,
        bhk_type: prop.bhk_type,
        property_type: prop.property_type,
        furnishing_type: 'Not applicable',
        parking_type: null,
        amenities: prop.amenities || {},
        property_images: prop.property_images || {},
        images: prop.property_images?.general_photos?.exterior || [],
        created_at: prop.created_at,
        offers_available: prop.loan_available || false,
        status: prop.construction_status || 'under_construction',
        project_name: prop.project_name,
        rera_number: prop.rera_number,
        // Additional new project fields
        crafted_by: prop.crafted_by,
        project_type: prop.project_type,
        construction_type: prop.construction_type,
        project_location: prop.project_location,
        rooms_per_floor: prop.rooms_per_floor,
        cp_sables: prop.cp_sables,
        other_notes: prop.other_notes,
        contact_name_1: prop.contact_name_1,
        contact_number_1: prop.contact_number_1,
        contact_name_2: prop.contact_name_2,
        contact_number_2: prop.contact_number_2,
        is_govt_approved: prop.is_govt_approved,
        is_rera_approved: prop.is_rera_approved,
        loan_available: prop.loan_available,
        social_media_marketing_allowed: prop.social_media_marketing_allowed,
        important_notes: prop.important_notes,
        units_available_for_sale: prop.units_available_for_sale,
        project_conversion_rate: prop.project_conversion_rate,
        notes: prop.important_notes || prop.other_notes
      };
    }
    
    return prop; // Return as-is if type doesn't match
  };

  const handleFavoriteToggle = () => {
    const favorites = localStorage.getItem('favoriteProperties');
    const favoriteIds = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      const updatedFavorites = favoriteIds.filter((favId: string) => favId !== id);
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favoriteIds, id];
      localStorage.setItem('favoriteProperties', JSON.stringify(updatedFavorites));
    }
    
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  };

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

  const getPropertyImages = () => {
    const images: string[] = [];
    
    // First, try to use the direct images array
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      return property.images.filter(img => img && img.trim() !== '');
    }
    
    // Then try to extract images from the property_images JSONB structure
    if (property?.property_images && typeof property.property_images === 'object') {
      // Check general_photos
      if (property.property_images.general_photos) {
        if (property.property_images.general_photos.exterior && Array.isArray(property.property_images.general_photos.exterior)) {
          images.push(...property.property_images.general_photos.exterior.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.general_photos.interior && Array.isArray(property.property_images.general_photos.interior)) {
          images.push(...property.property_images.general_photos.interior.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.general_photos.bedrooms && Array.isArray(property.property_images.general_photos.bedrooms)) {
          images.push(...property.property_images.general_photos.bedrooms.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.general_photos.kitchen && Array.isArray(property.property_images.general_photos.kitchen)) {
          images.push(...property.property_images.general_photos.kitchen.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.general_photos.bathrooms && Array.isArray(property.property_images.general_photos.bathrooms)) {
          images.push(...property.property_images.general_photos.bathrooms.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.general_photos.amenities && Array.isArray(property.property_images.general_photos.amenities)) {
          images.push(...property.property_images.general_photos.amenities.filter(img => img && img.trim() !== ''));
        }
      }
      
      // Check floor_plans
      if (property.property_images.floor_plans) {
        if (property.property_images.floor_plans.floor_plan && Array.isArray(property.property_images.floor_plans.floor_plan)) {
          images.push(...property.property_images.floor_plans.floor_plan.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.floor_plans.site_plan && Array.isArray(property.property_images.floor_plans.site_plan)) {
          images.push(...property.property_images.floor_plans.site_plan.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.floor_plans.blueprint && Array.isArray(property.property_images.floor_plans.blueprint)) {
          images.push(...property.property_images.floor_plans.blueprint.filter(img => img && img.trim() !== ''));
        }
        if (property.property_images.floor_plans.elevation && Array.isArray(property.property_images.floor_plans.elevation)) {
          images.push(...property.property_images.floor_plans.elevation.filter(img => img && img.trim() !== ''));
        }
      }
    }
    
    // Return images if we found any, otherwise return empty array
    return images.length > 0 ? images : [];
  };

  const getPropertyPrice = () => {
    if (property?.type === 'resale') {
      return formatPrice(property.asking_price || 0);
    } else if (property?.type === 'rental') {
      return `${formatPrice(property.rent_amount || 0)}/month`;
    } else if (property?.type === 'new_project') {
      return formatPrice(property.starting_price || 0);
    }
    return 'Price on request';
  };

  const getContactInfo = () => {
    if (property?.type === 'resale') {
      return {
        name: property.seller_name || 'Seller',
        email: property.seller_email || '',
        phone: property.seller_contact_no || ''
      };
    } else if (property?.type === 'rental') {
      return {
        name: property.owner_name || 'Owner',
        email: property.owner_email || '',
        phone: property.owner_contact_no || ''
      };
    } else if (property?.type === 'new_project') {
      return {
        name: property.developer_name || 'Developer',
        email: '',
        phone: ''
      };
    }
    return { name: '', email: '', phone: '' };
  };

  const getAllAmenities = () => {
    if (!property?.amenities) return [];
    
    const amenities: string[] = [];
    const amenityCategories = [
      'basic_amenities',
      'luxury_amenities', 
      'infrastructure',
      'services',
      'commercial_amenities',
      'project_specific'
    ];

    amenityCategories.forEach(category => {
      if (property.amenities[category]) {
        Object.entries(property.amenities[category]).forEach(([key, value]) => {
          if (value === true) {
            amenities.push(key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
          }
        });
      }
    });

    return amenities;
  };

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The property you are looking for does not exist.'}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const images = getPropertyImages();
  const contactInfo = getContactInfo();
  const amenities = getAllAmenities();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleFavoriteToggle}
                className="flex items-center space-x-2 px-4 py-2 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                {isFavorite ? (
                  <HeartIconSolid className="w-5 h-5 text-orange-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-orange-600" />
                )}
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>
              
              <ShareButtonDropdown 
                property={{
                  title: property.title,
                  location: property.location,
                  price: property.asking_price || property.rent_amount || property.starting_price || 0,
                  bhkType: property.bhk_type,
                  carpetArea: property.carpet_area ? parseInt(property.carpet_area) : undefined,
                  propertyType: property.property_type,
                  id: property.id,
                  type: property.type
                }}
                variant="default"
                size="md"
                onShowSuccess={showSuccess}
                onShowError={showError}
                onShowInfo={showInfo}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {images.length > 0 ? (
                    <img
                      src={images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/800/600';
                      }}
                    />
                  ) : (
                    <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-200">
                      <HomeIcon className="w-16 h-16 text-gray-400 mb-4" />
                      <span className="text-lg text-gray-500">No Images Available</span>
                      <span className="text-sm text-gray-400 mt-2">Images will be displayed here when available</span>
                    </div>
                  )}
                </div>
                
                {/* Image Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
                    >
                      ›
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{property.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-8">
                <MapPinIcon className="w-5 h-5 mr-2" />
                <span>{property.location}</span>
              </div>

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <HomeIcon className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Property Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <BuildingOfficeIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">BHK Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {property.bhk_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>

                {property.built_up_area && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <SwatchIcon className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Built-up Area</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{property.built_up_area}</p>
                  </div>
                )}

                {property.carpet_area && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <SwatchIcon className="w-5 h-5 text-indigo-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Carpet Area</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{property.carpet_area}</p>
                  </div>
                )}

                {property.furnishing_type && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <HomeIcon className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Furnishing</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.furnishing_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                )}

                {property.parking_type && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Parking</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.parking_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                )}

                {property.society_name && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-teal-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Society Name</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{property.society_name}</p>
                  </div>
                )}

                {property.flat_no && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <HomeIcon className="w-5 h-5 text-pink-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Flat Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{property.flat_no}</p>
                  </div>
                )}

                {property.floor_no && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <BuildingOfficeIcon className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Floor</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{property.floor_no}</p>
                  </div>
                )}

                {property.facing && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <MapPinIcon className="w-5 h-5 text-cyan-600 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Facing</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{property.facing}</p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {property.type === 'rental' && (
                    <>
                      {property.deposit_amount && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-600">Security Deposit</p>
                              <p className="text-2xl font-bold text-blue-900">₹{property.deposit_amount.toLocaleString()}</p>
                              {property.deposit_negotiable && (
                                <span className="text-xs text-green-600">(Negotiable)</span>
                              )}
                            </div>
                            <CurrencyRupeeIcon className="w-8 h-8 text-blue-600" />
                          </div>
                        </div>
                      )}
                      {property.immediate_possession && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckIcon className="w-6 h-6 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-green-600">Possession</p>
                              <p className="text-lg font-semibold text-green-900">Immediate Available</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.available_from_date && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <CalendarIcon className="w-6 h-6 text-purple-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-purple-600">Available From</p>
                              <p className="text-lg font-semibold text-purple-900">
                                {new Date(property.available_from_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.rent_negotiable && (
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckIcon className="w-6 h-6 text-orange-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-orange-600">Rent Negotiable</p>
                              <p className="text-lg font-semibold text-orange-900">Yes</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {(property.allowed_for_family || property.allowed_for_bachelor || property.allowed_for_anyone) && (
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <UserIcon className="w-6 h-6 text-indigo-600 mr-3" />
                            <p className="text-sm font-medium text-indigo-600">Tenant Type</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {property.allowed_for_family && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Family</span>
                            )}
                            {property.allowed_for_bachelor && (
                              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Bachelor</span>
                            )}
                            {property.allowed_for_anyone && (
                              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">Anyone</span>
                            )}
                          </div>
                        </div>
                      )}
                      {property.pets_allowed && (
                        <div className="bg-pink-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckIcon className="w-6 h-6 text-pink-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-pink-600">Pets Allowed</p>
                              <p className="text-lg font-semibold text-pink-900">Yes</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {property.type === 'resale' && (
                    <>
                      {property.property_age && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <ClockIcon className="w-6 h-6 text-gray-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-600">Property Age</p>
                              <p className="text-lg font-semibold text-gray-900">{property.property_age}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.is_negotiable && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <CheckIcon className="w-6 h-6 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-green-600">Price Negotiable</p>
                              <p className="text-lg font-semibold text-green-900">Yes</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {property.type === 'new_project' && (
                    <>
                      {property.rera_number && (
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-blue-600">RERA Number</p>
                              <p className="text-lg font-semibold text-blue-900">{property.rera_number}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.project_status && (
                        <div className="bg-orange-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-orange-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-orange-600">Construction Status</p>
                              <p className="text-lg font-semibold text-orange-900">
                                {property.project_status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.crafted_by && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <UserIcon className="w-6 h-6 text-purple-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-purple-600">Developer</p>
                              <p className="text-lg font-semibold text-purple-900">{property.crafted_by}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.units_available_for_sale && (
                        <div className="bg-green-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="w-6 h-6 text-green-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-green-600">Units Available</p>
                              <p className="text-lg font-semibold text-green-900">{property.units_available_for_sale}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {property.project_conversion_rate && (
                        <div className="bg-indigo-50 rounded-lg p-4">
                          <div className="flex items-center">
                            <CurrencyRupeeIcon className="w-6 h-6 text-indigo-600 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-indigo-600">Conversion Rate</p>
                              <p className="text-lg font-semibold text-indigo-900">{property.project_conversion_rate}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CalendarIcon className="w-6 h-6 text-gray-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Listed On</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(property.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Property Status</p>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {property.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      {property.offers_available && (
                        <CheckIcon className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center">
                        <CheckIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-sm font-medium text-green-900">{amenity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description/Notes */}
            {property.notes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {getPropertyPrice()}
                </div>
                {property.price_per_sqft && (
                  <div className="text-sm text-gray-600">
                    ₹{property.price_per_sqft.toLocaleString()}/sq.ft
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">Contact {contactInfo.name}</h4>
                
                {contactInfo.phone && (
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="w-full flex items-center justify-center space-x-2 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors mb-3"
                  >
                    <PhoneIcon className="w-5 h-5" />
                    <span>Call Now</span>
                  </a>
                )}
                
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="w-full flex items-center justify-center space-x-2 bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors mb-3"
                  >
                    <EnvelopeIcon className="w-5 h-5" />
                    <span>Send Email</span>
                  </a>
                )}
                
              </div>
            </div>

            {/* Property Status */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Property Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    property.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                {property.offers_available && (
                  <div className="flex items-center">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-700">Special Offers Available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        property={{
          title: property.title,
          location: property.location,
          price: property.asking_price || property.rent_amount || property.starting_price || 0,
          bhkType: property.bhk_type,
          carpetArea: property.carpet_area ? parseInt(property.carpet_area) : undefined,
          propertyType: property.property_type
        }}
      />

      {/* Toast Container */}
      <ToastContainer
        toasts={toasts}
        onRemove={removeToast}
      />
    </div>
  );
}
