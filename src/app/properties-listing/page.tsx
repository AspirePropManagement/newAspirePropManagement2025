'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';
import { 
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  BuildingOfficeIcon,
  UserIcon,
  ClockIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

/**
 * Properties Listing Page Content Component
 * Displays all properties with advanced filtering and search capabilities
 * Similar to PropertyPistol's property search interface
 */
function PropertiesListingContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12);
  const [filtersReady, setFiltersReady] = useState(false);

  // Normalize a location string coming from Google Places (e.g., "Pune, Maharashtra, India")
  // into the primary city/town part (e.g., "Pune"). If no comma is present, return as-is.
  const normalizeLocationString = (value: string) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (trimmed.includes(',')) {
      // Take the first segment (city/locality), e.g., "Pune"
      return trimmed.split(',')[0].trim();
    }
    return trimmed;
  };

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlFilters = {
      budget: [] as string[],
      propertyType: [] as string[],
      location: '',
      possession: [] as string[],
      bhkType: [] as string[],
      listedBy: [] as string[],
      ageOfProperty: [] as string[],
      amenities: [] as string[],
      propertiesWithPhotos: false
    };

    // Get property type from URL
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const mappedType = typeParam === 'new-projects' ? 'new_project' : typeParam;
      urlFilters.propertyType = [mappedType];
    }

    // Get location from URL
    const locationParam = searchParams.get('location');
    if (locationParam) {
      urlFilters.location = locationParam;
    }

    // Get BHK from URL (single value support)
    const bhkParam = searchParams.get('bhkType');
    if (bhkParam) {
      urlFilters.bhkType = [bhkParam];
    }

    setSelectedFilters(urlFilters);
    setFiltersReady(true);
  }, [searchParams]);

  // Fetch properties based on filters
  const fetchProperties = useCallback(async () => {
    if (!filtersReady) return;
    try {
      setLoading(true);
      setError(null);
      // Clear previous results to avoid showing stale data
      setProperties([]);

      if (!supabase) {
        setError('Database connection not available');
        setLoading(false);
        return;
      }

      // Always compute a stable snapshot of filters, preferring URL when present
      const rawLocation = searchParams.get('location') || selectedFilters.location;
      const locationFilter = normalizeLocationString(rawLocation);
      const typeFilters = selectedFilters.propertyType;
      const bhkFilters = selectedFilters.bhkType;

      let allProperties: any[] = [];

      // Fetch from resale_properties table
      if (typeFilters.length === 0 || typeFilters.includes('resale')) {
        let resaleQuery = supabase.from('resale_properties').select('*');

        if (locationFilter) {
          resaleQuery = resaleQuery.ilike('location', `%${locationFilter}%`);
        }

        if (bhkFilters.length > 0) {
          // Map filter values to database values
          const mappedBhkTypes = bhkFilters.map(type => {
            switch(type) {
              case '1_rk': return '1_rk';
              case '1_bhk': return '1_bhk';
              case '2': return '2_bhk';
              case '3': return '3_bhk';
              case '4': return '4_bhk';
              case '5': return '5_bhk';
              case '5+': return '5_plus_bhk';
              default: return type;
            }
          });
          resaleQuery = resaleQuery.in('bhk_type', mappedBhkTypes);
        }


        const { data: resaleData, error: resaleError } = await resaleQuery;
        if (resaleError) throw resaleError;
        console.log('Resale properties:', resaleData?.length || 0, resaleData);

        // Transform resale properties to match expected format
        const transformedResale = (resaleData || []).map(prop => ({
          ...prop,
          title: `${prop.bhk_type.replace('_', ' ').toUpperCase()} ${prop.property_type.replace('_', ' ').toUpperCase()}`,
          description: prop.notes || '',
          price: prop.asking_price,
          type: 'resale', // PropertyCard expects 'type' not 'property_type'
          asking_price: prop.asking_price, // PropertyCard expects this for price calculation
          bedrooms: prop.bhk_type.includes('1') ? 1 : prop.bhk_type.includes('2') ? 2 : prop.bhk_type.includes('3') ? 3 : prop.bhk_type.includes('4') ? 4 : 5,
          bathrooms: prop.bhk_type.includes('1') ? 1 : prop.bhk_type.includes('2') ? 2 : prop.bhk_type.includes('3') ? 3 : prop.bhk_type.includes('4') ? 4 : 5,
          square_feet: prop.square_feet,
          carpet_area: prop.carpet_area,
          images: prop.images || []
        }));

        allProperties = [...allProperties, ...transformedResale];
        console.log('Transformed resale properties:', transformedResale);
      }

      // Fetch from rental_properties table
      if (typeFilters.length === 0 || typeFilters.includes('rental')) {
        let rentalQuery = supabase.from('rental_properties').select('*');

        if (locationFilter) {
          rentalQuery = rentalQuery.ilike('location', `%${locationFilter}%`);
        }

        if (bhkFilters.length > 0) {
          // Map filter values to database values
          const mappedBhkTypes = bhkFilters.map(type => {
            switch(type) {
              case '1_rk': return '1_rk';
              case '1_bhk': return '1_bhk';
              case '2': return '2_bhk';
              case '3': return '3_bhk';
              case '4': return '4_bhk';
              case '5': return '5_bhk';
              case '5+': return '5_plus_bhk';
              default: return type;
            }
          });
          rentalQuery = rentalQuery.in('bhk_type', mappedBhkTypes);
        }


        const { data: rentalData, error: rentalError } = await rentalQuery;
        if (rentalError) throw rentalError;
        console.log('Rental properties:', rentalData?.length || 0, rentalData);

        // Transform rental properties to match expected format
        const transformedRental = (rentalData || []).map(prop => ({
          ...prop,
          title: `${prop.bhk_type.replace('_', ' ').toUpperCase()} ${prop.property_type.replace('_', ' ').toUpperCase()}`,
          description: `Rental property in ${prop.location}`,
          price: prop.rent_amount,
          type: 'rental', // PropertyCard expects 'type' not 'property_type'
          rent_amount: prop.rent_amount, // PropertyCard expects this for price calculation
          bedrooms: prop.bhk_type.includes('1') ? 1 : prop.bhk_type.includes('2') ? 2 : prop.bhk_type.includes('3') ? 3 : prop.bhk_type.includes('4') ? 4 : 5,
          bathrooms: prop.bhk_type.includes('1') ? 1 : prop.bhk_type.includes('2') ? 2 : prop.bhk_type.includes('3') ? 3 : prop.bhk_type.includes('4') ? 4 : 5,
          square_feet: null,
          carpet_area: null,
          images: prop.images || []
        }));

        allProperties = [...allProperties, ...transformedRental];
      }

      // Fetch from new_projects table
      if (typeFilters.length === 0 || typeFilters.includes('new_project')) {
        let newProjectQuery = supabase.from('new_projects').select('*');

        if (locationFilter) {
          newProjectQuery = newProjectQuery.ilike('project_location', `%${locationFilter}%`);
        }

        // Note: new_projects table doesn't have bhk_type column, so we skip this filter


        const { data: newProjectData, error: newProjectError } = await newProjectQuery;
        if (newProjectError) throw newProjectError;
        console.log('New projects:', newProjectData?.length || 0, newProjectData);

        // Transform new projects to match expected format
        const transformedNewProjects = (newProjectData || []).map(prop => ({
          ...prop,
          title: prop.project_name || 'New Project',
          description: prop.other_notes || prop.important_notes || '',
          price: 0, // New projects don't have price in this schema
          type: 'new_project', // PropertyCard expects 'type' not 'property_type'
          starting_price: 0, // New projects don't have price in this schema
          bedrooms: 0, // Not available in this schema
          bathrooms: 0, // Not available in this schema
          square_feet: null,
          carpet_area: null,
          location: prop.project_location, // Map project_location to location
          images: prop.images || []
        }));

        allProperties = [...allProperties, ...transformedNewProjects];
      }

      // Apply sorting to combined results
      switch (sortBy) {
        case 'price-low-high':
          allProperties.sort((a, b) => a.price - b.price);
          break;
        case 'price-high-low':
          allProperties.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          allProperties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          break;
        default:
          allProperties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      // Apply final in-memory filters to ensure correctness
      const finallyFiltered = allProperties.filter((p) => {
        // Enforce property type filter strictly
        if (typeFilters.length > 0 && !typeFilters.includes(p.type)) {
          return false;
        }
        // Enforce location filter across all types
        if (locationFilter) {
          const locationValue = p.type === 'new_project' ? (p.project_location || p.location || '') : (p.location || '');
          if (!locationValue || !locationValue.toLowerCase().includes(locationFilter.toLowerCase())) {
            return false;
          }
        }
        // Enforce BHK filter when available (skip for new projects)
        if (bhkFilters.length > 0) {
          if (p.type !== 'new_project') {
            const bhk = p.bhk_type;
            if (!bhk || !bhkFilters.includes(bhk)) {
              return false;
            }
          }
        }
        return true;
      });

      console.log('Fetched properties:', allProperties.length, 'After filters:', finallyFiltered.length);
      setProperties(finallyFiltered);
      setTotalPages(Math.ceil(finallyFiltered.length / itemsPerPage));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedFilters, sortBy, itemsPerPage]);

  useEffect(() => {
    if (filtersReady) {
      fetchProperties();
    }
  }, [fetchProperties, filtersReady]);

  const handleFilterChange = (filterType: string, value: string | string[] | boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleCheckboxChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: Array.isArray(prev[filterType as keyof typeof prev]) && (prev[filterType as keyof typeof prev] as string[]).includes(value)
        ? (prev[filterType as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[filterType as keyof typeof prev] as string[]), value]
    }));
    setCurrentPage(1);
  };

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
    setCurrentPage(1);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedFilters.budget.length > 0) count++;
    if (selectedFilters.propertyType.length > 0) count++;
    if (selectedFilters.location) count++;
    if (selectedFilters.possession.length > 0) count++;
    if (selectedFilters.bhkType.length > 0) count++;
    if (selectedFilters.listedBy.length > 0) count++;
    if (selectedFilters.ageOfProperty.length > 0) count++;
    if (selectedFilters.amenities.length > 0) count++;
    if (selectedFilters.propertiesWithPhotos) count++;
    return count;
  };

  // Get display data based on property type filter
  const getDisplayData = () => {
    const hasResale = selectedFilters.propertyType.includes('resale');
    const hasRental = selectedFilters.propertyType.includes('rental');
    const hasNewProject = selectedFilters.propertyType.includes('new_project');
    const where = selectedFilters.location ? ` in ${selectedFilters.location}` : '';

    if (hasResale && !hasRental && !hasNewProject) {
      return {
        mainHeading: `Resale Properties${where}`,
        subHeading: `${properties.length} properties available for sale`
      };
    } else if (hasRental && !hasResale && !hasNewProject) {
      return {
        mainHeading: `Rental Properties${where}`,
        subHeading: `${properties.length} properties available for rent`
      };
    } else if (hasNewProject && !hasResale && !hasRental) {
      return {
        mainHeading: `New Projects${where}`,
        subHeading: `${properties.length} new projects available`
      };
    } else {
      return {
        mainHeading: `Properties${where}`,
        subHeading: `${properties.length} properties available`
      };
    }
  };

  const { mainHeading, subHeading } = getDisplayData();

  // Pagination
  const paginatedProperties = properties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">

      {/* Main Content - Layout with Fixed Sidebar */}
      <div className="flex">
        {/* Mobile Overlay */}
        {showFilters && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
        )}
        
        {/* Left Sidebar - Scrollable Filters */}
        <div className={`w-80 lg:block ${showFilters ? 'block' : 'hidden'} bg-white/90 backdrop-blur-lg border-r border-gray-200/50 flex-shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:z-30 fixed top-0 left-0 h-full z-30 overflow-y-auto shadow-2xl`}>
          <div className="p-6 space-y-6">
            {/* Mobile Close Button */}
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Header with Reset Button */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              </div>
              <button
                onClick={clearFilters}
                className="group flex items-center space-x-2 px-3 py-2 text-orange-600 hover:text-white hover:bg-orange-500 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-semibold">Reset</span>
              </button>
            </div>

            {/* Location Search */}
            <div className="group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 text-base">Location</h4>
              </div>
              <GooglePlacesAutocomplete
                value={selectedFilters.location}
                onChange={(value) => handleFilterChange('location', value)}
                placeholder="Search location (e.g., Pune, Maharashtra)"
                className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white"
              />
            </div>

            {/* Select your budget */}
            <div className="group p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 text-base">Budget Range</h4>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'under-40', label: 'Under 40 lacs' },
                  { value: '40-70', label: '40 lacs - 70 lacs' },
                  { value: '70-100', label: '70 lacs - 1 Crore' },
                  { value: '100-200', label: '1 Crore - 2 Crore' },
                  { value: 'above-200', label: 'Above 2 Crore' },
                  { value: 'on-request', label: 'On request/Coming Soon' }
                ].map((option) => (
                  <label key={option.value} className="group/item flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={selectedFilters.budget.includes(option.value)}
                      onChange={() => handleCheckboxChange('budget', option.value)}
                      className="w-4 h-4 text-green-500 border-green-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* BHK Types */}
            <div className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <HomeIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Unit Types</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '1_rk', label: '1 RK' },
                  { value: '1_bhk', label: '1 BHK' },
                  { value: '2_bhk', label: '2 BHK' },
                  { value: '3_bhk', label: '3 BHK' },
                  { value: '4_bhk', label: '4 BHK' },
                  { value: '5_bhk', label: '5 BHK' },
                  { value: '5_plus_bhk', label: '5+ BHK' }
                ].map((option) => (
                  <label key={option.value} className="group/item flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={selectedFilters.bhkType.includes(option.value)}
                      onChange={() => handleCheckboxChange('bhkType', option.value)}
                      className="w-4 h-4 text-purple-500 border-purple-300 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                    />
                    <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div className="group p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BuildingOfficeIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Property Type</h4>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'resale', label: 'Resale Properties', icon: '🏠' },
                  { value: 'rental', label: 'Rental Properties', icon: '🔑' },
                  { value: 'new_project', label: 'New Projects', icon: '🏗️' }
                ].map((option) => (
                  <label key={option.value} className="group/item flex items-center space-x-3 cursor-pointer p-3 rounded-xl hover:bg-white/60 transition-all duration-200 border border-transparent hover:border-cyan-200">
                    <input
                      type="checkbox"
                      checked={selectedFilters.propertyType.includes(option.value)}
                      onChange={() => handleCheckboxChange('propertyType', option.value)}
                      className="w-4 h-4 text-cyan-500 border-cyan-300 rounded focus:ring-cyan-500 focus:ring-2 transition-all duration-200"
                    />
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Listed By */}
            <div className="group p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserIcon className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Listed By</h4>
              </div>
              <div className="space-y-3">
                <label className="group/item flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={selectedFilters.listedBy.includes('builder')}
                    onChange={() => handleCheckboxChange('listedBy', 'builder')}
                    className="w-4 h-4 text-yellow-500 border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2 transition-all duration-200"
                  />
                  <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">🏢 Developer</span>
                </label>
                <label className="group/item flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={selectedFilters.listedBy.includes('individual')}
                    onChange={() => handleCheckboxChange('listedBy', 'individual')}
                    className="w-4 h-4 text-yellow-500 border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2 transition-all duration-200"
                  />
                  <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">👤 Individual Owner</span>
                </label>
                <label className="group/item flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={selectedFilters.listedBy.includes('agent')}
                    onChange={() => handleCheckboxChange('listedBy', 'agent')}
                    className="w-4 h-4 text-yellow-500 border-yellow-300 rounded focus:ring-yellow-500 focus:ring-2 transition-all duration-200"
                  />
                  <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">🏘️ Real Estate Agent</span>
                </label>
              </div>
            </div>

            {/* Furnishing Type */}
            <div className="group p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 text-base">Furnishing</h4>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'fully_furnished', label: 'Fully Furnished', icon: '🛋️' },
                  { value: 'semi_furnished', label: 'Semi Furnished', icon: '🪑' },
                  { value: 'un_furnished', label: 'Unfurnished', icon: '🏠' }
                ].map((option) => (
                  <label key={option.value} className="group/item flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={selectedFilters.ageOfProperty.includes(option.value)}
                      onChange={() => handleCheckboxChange('ageOfProperty', option.value)}
                      className="w-4 h-4 text-teal-500 border-teal-300 rounded focus:ring-teal-500 focus:ring-2 transition-all duration-200"
                    />
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm text-gray-700 font-medium group-hover/item:text-gray-900 transition-colors duration-200">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Properties with Photos */}
            <div className="group p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100 hover:shadow-lg transition-all duration-300">
              <label className="group/item flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.propertiesWithPhotos}
                  onChange={(e) => handleFilterChange('propertiesWithPhotos', e.target.checked)}
                  className="w-4 h-4 text-pink-500 border-pink-300 rounded focus:ring-pink-500 focus:ring-2 transition-all duration-200"
                />
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PhotoIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-bold group-hover/item:text-gray-900 transition-colors duration-200">Properties with Photos</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Content - Properties Grid */}
        <div className="flex-1 min-h-screen bg-white/30 backdrop-blur-sm">
          <div className="p-6">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Bars3Icon className="w-5 h-5" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-white text-orange-600 text-xs rounded-full px-2.5 py-1 min-w-[24px] h-6 flex items-center justify-center font-bold shadow-md">
                    {getActiveFilterCount()}
                  </span>
                )}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8 p-6 bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">{mainHeading}</h1>
                <p className="text-gray-600 text-lg font-medium">
                  {subHeading}
                </p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl flex items-center justify-center">
                  <HomeIcon className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Location Search Bar */}
            <div className="mb-8">
              <div className="max-w-5xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <label className="block text-lg font-bold text-gray-900">
                    Search by Location
                  </label>
                </div>
                <GooglePlacesAutocomplete
                  value={selectedFilters.location}
                  onChange={(value) => handleFilterChange('location', value)}
                  placeholder="Enter location (e.g., Pune, Maharashtra)"
                  className="w-full px-6 py-4 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white shadow-lg focus:shadow-xl"
                />
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
                  <HomeIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {paginatedProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-6 sm:px-6 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center space-x-1">
                        {(() => {
                          const pages = [];
                          const showEllipsis = totalPages > 6;
                          
                          if (showEllipsis) {
                            // Always show first page
                            pages.push(
                              <button
                                key={1}
                                onClick={() => setCurrentPage(1)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  currentPage === 1
                                    ? 'bg-orange-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                1
                              </button>
                            );

                            // Show second page if current page is not near the beginning
                            if (currentPage > 3) {
                              pages.push(
                                <button
                                  key={2}
                                  onClick={() => setCurrentPage(2)}
                                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                  2
                                </button>
                              );
                            }

                            // Show ellipsis if current page is far from beginning
                            if (currentPage > 4) {
                              pages.push(
                                <span key="ellipsis1" className="px-2 py-2 text-sm text-gray-500">
                                  ...
                                </span>
                              );
                            }

                            // Show current page and surrounding pages
                            const startPage = Math.max(3, currentPage - 1);
                            const endPage = Math.min(totalPages - 1, currentPage + 1);

                            for (let i = startPage; i <= endPage; i++) {
                              if (i !== 1 && i !== totalPages) {
                                pages.push(
                                  <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                      currentPage === i
                                        ? 'bg-orange-600 text-white'
                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                    }`}
                                  >
                                    {i}
                                  </button>
                                );
                              }
                            }

                            // Show ellipsis if current page is far from end
                            if (currentPage < totalPages - 3) {
                              pages.push(
                                <span key="ellipsis2" className="px-2 py-2 text-sm text-gray-500">
                                  ...
                                </span>
                              );
                            }

                            // Show second to last page if current page is not near the end
                            if (currentPage < totalPages - 2) {
                              pages.push(
                                <button
                                  key={totalPages - 1}
                                  onClick={() => setCurrentPage(totalPages - 1)}
                                  className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                  {totalPages - 1}
                                </button>
                              );
                            }

                            // Always show last page
                            pages.push(
                              <button
                                key={totalPages}
                                onClick={() => setCurrentPage(totalPages)}
                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                  currentPage === totalPages
                                    ? 'bg-orange-600 text-white'
                                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                }`}
                              >
                                {totalPages}
                              </button>
                            );
                          } else {
                            // Show all pages if 6 or fewer
                            for (let i = 1; i <= totalPages; i++) {
                              pages.push(
                                <button
                                  key={i}
                                  onClick={() => setCurrentPage(i)}
                                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                                    currentPage === i
                                      ? 'bg-orange-600 text-white'
                                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {i}
                                </button>
                              );
                            }
                          }

                          return pages;
                        })()}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

/**
 * Properties Listing Page with Suspense Boundary
 * Wraps the content component to handle useSearchParams properly
 */
export default function PropertiesListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesListingContent />
    </Suspense>
  );
}