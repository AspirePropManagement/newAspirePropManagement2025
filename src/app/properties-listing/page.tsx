'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
import { FilterModalSkeleton } from '@/components/skeletons';
import FilterModal from '@/components/FilterModal';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  MapPinIcon,
  Bars3Icon,
  CheckIcon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserIcon,
  ClockIcon,
  SwatchIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

/**
 * Properties Listing Page
 * Displays all properties with advanced filtering and search capabilities
 * Similar to PropertyPistol's property search interface
 */
export default function PropertiesListingPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    budget: [] as string[],
    propertyType: [] as string[],
    location: '',
    possession: [] as string[],
    bhkType: [] as string[],
    listedBy: [] as string[],
    ageOfProperty: [] as string[],
    amenities: [] as string[],
    propertiesWithPhotos: false
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, [currentPage, selectedFilters, sortBy]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.sort-dropdown')) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Fetches properties from all property tables with filtering and pagination
   */
  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch properties from all tables
      const [resaleResponse, rentalResponse, newProjectResponse] = await Promise.all([
        fetch('/api/properties/resale'),
        fetch('/api/properties/rental'),
        fetch('/api/properties/new-projects')
      ]);

      const resaleProperties = resaleResponse.ok ? await resaleResponse.json() : [];
      const rentalProperties = rentalResponse.ok ? await rentalResponse.json() : [];
      const newProjectProperties = newProjectResponse.ok ? await newProjectResponse.json() : [];

      // Transform and combine all properties into a unified format
      let allProperties = [
        ...resaleProperties.map((prop: any) => ({
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
          status: prop.status || 'available'
        })),
        ...rentalProperties.map((prop: any) => ({
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
          available_from_date: prop.available_from_date
        })),
        ...newProjectProperties.map((prop: any) => ({
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
          rera_number: prop.rera_number
        }))
      ];

      // Apply search filter
      if (searchQuery) {
        allProperties = allProperties.filter(property => 
          property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.seller_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.developer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.project_name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filters
      allProperties = applyFilters(allProperties);

      // Apply sorting
      allProperties = applySorting(allProperties);

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedProperties = allProperties.slice(startIndex, endIndex);

      setProperties(paginatedProperties);
      setTotalPages(Math.ceil(allProperties.length / itemsPerPage));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Applies selected filters to the properties list
   */
  const applyFilters = (properties: any[]) => {
    let filtered = properties;

    // Budget filter
    if (selectedFilters.budget.length > 0) {
      filtered = filtered.filter(property => {
        const price = property.asking_price || property.rent_amount || property.starting_price;
        return selectedFilters.budget.some(budget => {
          switch (budget) {
            case 'under-40': return price < 4000000;
            case '40-70': return price >= 4000000 && price < 7000000;
            case '70-1cr': return price >= 7000000 && price < 10000000;
            case '1-2cr': return price >= 10000000 && price < 20000000;
            case 'above-2cr': return price >= 20000000;
            default: return true;
          }
        });
      });
    }

    // BHK Type filter
    if (selectedFilters.bhkType.length > 0) {
      filtered = filtered.filter(property => 
        selectedFilters.bhkType.includes(property.bhk_type)
      );
    }

    // Property Type filter
    if (selectedFilters.propertyType.length > 0) {
      filtered = filtered.filter(property => 
        selectedFilters.propertyType.includes(property.type)
      );
    }

    // Location filter
    if (selectedFilters.location) {
      filtered = filtered.filter(property => 
        property.location?.toLowerCase().includes(selectedFilters.location.toLowerCase())
      );
    }

    // Possession filter
    if (selectedFilters.possession.length > 0) {
      filtered = filtered.filter(property => {
        if (property.type === 'new_project') {
          return selectedFilters.possession.some(possession => {
            switch (possession) {
              case 'ready': return property.project_status === 'ready_to_move';
              case 'under_construction': return property.project_status === 'under_construction';
              case 'planning': return property.project_status === 'planning';
              case 'completed': return property.project_status === 'completed';
              default: return true;
            }
          });
        } else {
          // For resale and rental properties, they are always ready to move
          return selectedFilters.possession.includes('ready');
        }
      });
    }

    // Listed By filter
    if (selectedFilters.listedBy.length > 0) {
      filtered = filtered.filter(property => {
        if (selectedFilters.listedBy.includes('developer')) {
          return property.type === 'new_project';
        }
        if (selectedFilters.listedBy.includes('individual')) {
          return property.type === 'resale' || property.type === 'rental';
        }
        if (selectedFilters.listedBy.includes('agent')) {
          return property.type === 'resale' || property.type === 'rental';
        }
        return true;
      });
    }

    // Furnishing type filter (using ageOfProperty field for now)
    if (selectedFilters.ageOfProperty.length > 0) {
      filtered = filtered.filter(property => 
        selectedFilters.ageOfProperty.includes(property.furnishing_type)
      );
    }

    // Amenities filter
    if (selectedFilters.amenities.length > 0) {
      filtered = filtered.filter(property => 
        selectedFilters.amenities.some(amenity => {
          // Check if amenity exists in the amenities object
          if (property.amenities && typeof property.amenities === 'object') {
            // Check in basic_amenities
            if (property.amenities.basic_amenities?.[amenity]) return true;
            // Check in luxury_amenities
            if (property.amenities.luxury_amenities?.[amenity]) return true;
            // Check in infrastructure
            if (property.amenities.infrastructure?.[amenity]) return true;
            // Check in services
            if (property.amenities.services?.[amenity]) return true;
            // Check in commercial_amenities
            if (property.amenities.commercial_amenities?.[amenity]) return true;
            // Check in project_specific
            if (property.amenities.project_specific?.[amenity]) return true;
            // Check in custom_amenities
            if (property.amenities.custom_amenities?.[amenity]) return true;
          }
          return false;
        })
      );
    }

    return filtered;
  };

  /**
   * Applies sorting to the properties list
   */
  const applySorting = (properties: any[]) => {
    switch (sortBy) {
      case 'relevance':
        return properties; // Keep original order
      case 'most-recent':
        return properties.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'price-high-low':
        return properties.sort((a, b) => {
          const priceA = a.asking_price || a.rent_amount || a.starting_price || 0;
          const priceB = b.asking_price || b.rent_amount || b.starting_price || 0;
          return priceB - priceA;
        });
      case 'price-low-high':
        return properties.sort((a, b) => {
          const priceA = a.asking_price || a.rent_amount || a.starting_price || 0;
          const priceB = b.asking_price || b.rent_amount || b.starting_price || 0;
          return priceA - priceB;
        });
      case 'area-high-low':
        return properties.sort((a, b) => {
          const areaA = a.carpet_area || a.super_built_up_area || a.built_up_area || 0;
          const areaB = b.carpet_area || b.super_built_up_area || b.built_up_area || 0;
          return areaB - areaA;
        });
      case 'area-low-high':
        return properties.sort((a, b) => {
          const areaA = a.carpet_area || a.super_built_up_area || a.built_up_area || 0;
          const areaB = b.carpet_area || b.super_built_up_area || b.built_up_area || 0;
          return areaA - areaB;
        });
      default:
        return properties;
    }
  };

  /**
   * Handles filter changes from modal
   */
  const handleFilterChange = (filters: any) => {
    setSelectedFilters(filters);
    setCurrentPage(1);
  };

  /**
   * Handles checkbox filter changes
   */
  const handleCheckboxChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType as keyof typeof prev] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
    setCurrentPage(1);
  };

  /**
   * Clears all filters
   */
  const clearFilters = () => {
    setSelectedFilters({
      budget: [],
      propertyType: [],
      location: '',
      possession: [],
      bhkType: [],
      listedBy: [],
      ageOfProperty: [],
      amenities: [],
      propertiesWithPhotos: false
    });
    setSearchQuery('');
  };

  /**
   * Handles sort option selection
   */
  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    setIsSortDropdownOpen(false);
    setCurrentPage(1);
  };

  /**
   * Gets the display text for the current sort option
   */
  const getSortDisplayText = () => {
    switch (sortBy) {
      case 'relevance': return 'Relevance';
      case 'most-recent': return 'Recent';
      case 'price-high-low': return 'Price ↓';
      case 'price-low-high': return 'Price ↑';
      case 'area-high-low': return 'Area ↓';
      case 'area-low-high': return 'Area ↑';
      default: return 'Sort by';
    }
  };

  /**
   * Formats price for display
   */
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lacs`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky Search and Filter Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 left-0 right-0 z-10 flex-shrink-0">
        <div className="w-full px-6 py-4">
          {/* Main Search and Filter Row */}
          <div className="flex items-center gap-2">
            {/* Location Selector */}
            <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
              <MapPinIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Pune</span>
            </button>

            {/* Search Input Field */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter Locality, Property or Developer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </button>

            {/* Desktop Filters Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="hidden lg:flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
            </button>

            {/* Sort by Button with Dropdown */}
            <div className="relative sort-dropdown">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors min-w-0"
              >
                <Bars3Icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate max-w-24">{getSortDisplayText()}</span>
              </button>

                             {/* Sort Dropdown Menu */}
               {isSortDropdownOpen && (
                 <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                   <div className="py-1">
                     {[
                       { value: 'relevance', label: 'Relevance' },
                       { value: 'most-recent', label: 'Most Recent' },
                       { value: 'price-high-low', label: 'Price - High to Low' },
                       { value: 'price-low-high', label: 'Price - Low to High' },
                       { value: 'area-high-low', label: 'Area - High to Low' },
                       { value: 'area-low-high', label: 'Area - Low to High' }
                     ].map((option) => (
                       <button
                         key={option.value}
                         onClick={() => handleSortChange(option.value)}
                         className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                       >
                         <span className="truncate">{option.label}</span>
                         {sortBy === option.value && (
                           <CheckIcon className="w-4 h-4 text-gray-900 flex-shrink-0" />
                         )}
                       </button>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Bottom Row with Checkbox and Breadcrumbs */}
          <div className="flex justify-between items-center mt-3">
            {/* Additional Filter Option */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.possession.includes('after3year')}
                onChange={() => handleCheckboxChange('possession', 'after3year')}
                className="w-3 h-3 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-xs text-gray-700">After 3 Years</span>
            </label>

            {/* Breadcrumbs */}
            <nav className="text-xs text-gray-500">
              <span>Home</span>
              <span className="mx-1">/</span>
              <span>Pune</span>
              <span className="mx-1">/</span>
              <span>Real Estate Pune</span>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content - Layout with Fixed Sidebar */}
      <div className="flex-1 relative">
        {/* Mobile Overlay */}
        {showFilters && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setShowFilters(false)}
          />
        )}
        
        {/* Left Sidebar - Fixed Filters */}
        <div className={`lg:w-80 lg:block ${showFilters ? 'block' : 'hidden'} bg-white border-r border-gray-200 flex-shrink-0 lg:fixed lg:top-[120px] lg:left-0 lg:h-[calc(100vh-120px)] lg:overflow-y-auto fixed top-0 left-0 h-full z-30 w-80 overflow-y-auto`}>
          <div className="p-6">
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Reset Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-orange-500 hover:text-orange-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm">Reset</span>
              </button>
            </div>

            {/* Select your budget */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Select your budget</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'under-40', label: 'Under 40 lacs' },
                  { value: '40-70', label: '40 lacs - 70 lacs' },
                  { value: '70-1cr', label: '70 lacs - 1 Crore' },
                  { value: '1-2cr', label: '1 Crore - 2 Crore' },
                  { value: 'above-2cr', label: 'Above 2 Crore' },
                  { value: 'on-request', label: 'On request/Coming Soon' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.budget.includes(option.value)}
                      onChange={() => handleCheckboxChange('budget', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Various unit types in Pune */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Various unit types in Pune</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: '1_rk_1_bhk', label: '1 RK/1 BHK' },
                  { value: '2_bhk', label: '2 BHK' },
                  { value: '3_bhk', label: '3 BHK' },
                  { value: '4_bhk', label: '4 BHK' },
                  { value: '5_bhk', label: '5 BHK' },
                  { value: '5_plus_bhk', label: '5+ BHK' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.bhkType.includes(option.value)}
                      onChange={() => handleCheckboxChange('bhkType', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Purchase Type */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Property Type</h4>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.propertyType.includes('resale')}
                    onChange={() => handleCheckboxChange('propertyType', 'resale')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Resale Properties</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.propertyType.includes('rental')}
                    onChange={() => handleCheckboxChange('propertyType', 'rental')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Rental Properties</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.propertyType.includes('new_project')}
                    onChange={() => handleCheckboxChange('propertyType', 'new_project')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">New Projects</span>
                </label>
              </div>
            </div>

            {/* Possession */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Possession</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'ready', label: 'Ready to Move' },
                  { value: 'under_construction', label: 'Under Construction' },
                  { value: 'planning', label: 'Planning Phase' },
                  { value: 'completed', label: 'Completed' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.possession.includes(option.value)}
                      onChange={() => handleCheckboxChange('possession', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Listed By */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Listed By</h4>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.listedBy.includes('developer')}
                    onChange={() => handleCheckboxChange('listedBy', 'developer')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Developer</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.listedBy.includes('individual')}
                    onChange={() => handleCheckboxChange('listedBy', 'individual')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Individual Owner</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.listedBy.includes('agent')}
                    onChange={() => handleCheckboxChange('listedBy', 'agent')}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Real Estate Agent</span>
                </label>
              </div>
            </div>

            {/* Furnishing Type */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Furnishing Type</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'fully_furnished', label: 'Fully Furnished' },
                  { value: 'semi_furnished', label: 'Semi Furnished' },
                  { value: 'un_furnished', label: 'Unfurnished' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.ageOfProperty.includes(option.value)}
                      onChange={() => handleCheckboxChange('ageOfProperty', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <SwatchIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Amenities</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'power_backup', label: 'Power Backup' },
                  { value: 'lift', label: 'Lift' },
                  { value: 'security', label: 'Security' },
                  { value: 'swimming_pool', label: 'Swimming Pool' },
                  { value: 'club_house', label: 'Club House' },
                  { value: 'gym', label: 'Gym' },
                  { value: 'park', label: 'Park' },
                  { value: 'gas_pipeline', label: 'Gas Pipeline' },
                  { value: 'cctv_surveillance', label: 'CCTV Surveillance' },
                  { value: 'visitor_parking', label: 'Visitor Parking' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.amenities.includes(option.value)}
                      onChange={() => handleCheckboxChange('amenities', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Properties with Photos */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <PhotoIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Properties with Photos</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Show only properties with photos</span>
                <button
                  onClick={() => setSelectedFilters(prev => ({ ...prev, propertiesWithPhotos: !prev.propertiesWithPhotos }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    selectedFilters.propertiesWithPhotos ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      selectedFilters.propertiesWithPhotos ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Properties Grid */}
        <div className="flex-1 overflow-y-auto bg-gray-50 lg:ml-80">
          <div className="p-6">
                         {/* Results Header */}
             <div className="flex items-center justify-between mb-6">
               <div>
                 <h1 className="text-2xl font-bold text-gray-900">Real Estate Pune - Property to buy in Pune</h1>
                 <p className="text-gray-600 mt-1">
                   Showing 1-{properties.length} of 1000 properties
                 </p>
               </div>
             </div>

            {/* Properties Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <PropertyCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Properties</h3>
                <p className="text-gray-600">{error}</p>
                <button
                  onClick={fetchProperties}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Try Again
                </button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border rounded-lg ${
                        currentPage === page
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
