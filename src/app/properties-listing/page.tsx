'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
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
 * Properties Listing Page
 * Displays all properties with advanced filtering and search capabilities
 * Similar to PropertyPistol's property search interface
 */
export default function PropertiesListingPage() {
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
      urlFilters.propertyType = [typeParam];
    }

    setSelectedFilters(urlFilters);
  }, [searchParams]);

  // Fetch properties based on filters
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let allProperties: any[] = [];

      // Fetch from resale_properties table
      if (selectedFilters.propertyType.length === 0 || selectedFilters.propertyType.includes('resale')) {
        let resaleQuery = supabase.from('resale_properties').select('*');

        if (selectedFilters.location) {
          resaleQuery = resaleQuery.ilike('location', `%${selectedFilters.location}%`);
        }

        if (selectedFilters.bhkType.length > 0) {
          // Map filter values to database values
          const mappedBhkTypes = selectedFilters.bhkType.map(type => {
            switch(type) {
              case '1': return '1_rk_1_bhk';
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
      if (selectedFilters.propertyType.length === 0 || selectedFilters.propertyType.includes('rental')) {
        let rentalQuery = supabase.from('rental_properties').select('*');

        if (selectedFilters.location) {
          rentalQuery = rentalQuery.ilike('location', `%${selectedFilters.location}%`);
        }

        if (selectedFilters.bhkType.length > 0) {
          // Map filter values to database values
          const mappedBhkTypes = selectedFilters.bhkType.map(type => {
            switch(type) {
              case '1': return '1_rk_1_bhk';
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
      if (selectedFilters.propertyType.length === 0 || selectedFilters.propertyType.includes('new_project')) {
        let newProjectQuery = supabase.from('new_projects').select('*');

        if (selectedFilters.location) {
          newProjectQuery = newProjectQuery.ilike('project_location', `%${selectedFilters.location}%`);
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

      console.log('Fetched properties:', allProperties.length, allProperties);
      setProperties(allProperties);
      setTotalPages(Math.ceil(allProperties.length / itemsPerPage));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedFilters, sortBy, itemsPerPage]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

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

    if (hasResale && !hasRental && !hasNewProject) {
      return {
        mainHeading: "Resale Properties in Pune",
        subHeading: `${properties.length} properties available for sale`
      };
    } else if (hasRental && !hasResale && !hasNewProject) {
      return {
        mainHeading: "Rental Properties in Pune",
        subHeading: `${properties.length} properties available for rent`
      };
    } else if (hasNewProject && !hasResale && !hasRental) {
      return {
        mainHeading: "New Projects in Pune",
        subHeading: `${properties.length} new projects available`
      };
    } else {
      return {
        mainHeading: "Properties in Pune",
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
    <div className="min-h-screen bg-gray-50">

      {/* Main Content - Layout with Fixed Sidebar */}
      <div className="flex">
        {/* Mobile Overlay */}
        {showFilters && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setShowFilters(false)}
          />
        )}
        
        {/* Left Sidebar - Scrollable Filters */}
        <div className={`w-80 lg:block ${showFilters ? 'block' : 'hidden'} bg-white border-r border-gray-200 flex-shrink-0 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:z-30 fixed top-0 left-0 h-full z-30 overflow-y-auto shadow-lg`}>
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

            {/* Reset Button */}
            <div className="flex items-center justify-between">
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
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Select your budget</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'under-40', label: 'Under 40 lacs' },
                  { value: '40-70', label: '40 lacs - 70 lacs' },
                  { value: '70-100', label: '70 lacs - 1 Crore' },
                  { value: '100-200', label: '1 Crore - 2 Crore' },
                  { value: 'above-200', label: 'Above 2 Crore' },
                  { value: 'on-request', label: 'On request/Coming Soon' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.budget.includes(option.value)}
                      onChange={() => handleCheckboxChange('budget', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Various unit types in Pune */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <HomeIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Various unit types in Pune</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: '1', label: '1 RK/1 BHK' },
                  { value: '2', label: '2 BHK' },
                  { value: '3', label: '3 BHK' },
                  { value: '4', label: '4 BHK' },
                  { value: '5', label: '5 BHK' },
                  { value: '5+', label: '5+ BHK' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.bhkType.includes(option.value)}
                      onChange={() => handleCheckboxChange('bhkType', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Property Type</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'resale', label: 'Resale Properties' },
                  { value: 'rental', label: 'Rental Properties' },
                  { value: 'new_project', label: 'New Projects' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters.propertyType.includes(option.value)}
                      onChange={() => handleCheckboxChange('propertyType', option.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Listed By */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Listed By</h4>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFilters.listedBy.includes('builder')}
                    onChange={() => handleCheckboxChange('listedBy', 'builder')}
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
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Furnishing Type</h4>
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
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Properties with Photos */}
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.propertiesWithPhotos}
                  onChange={(e) => handleFilterChange('propertiesWithPhotos', e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <div className="flex items-center space-x-2">
                  <PhotoIcon className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">Properties with Photos</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Content - Properties Grid */}
        <div className="flex-1 min-h-screen">
          <div className="p-6">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Bars3Icon className="w-4 h-4" />
                <span>Filters</span>
                {getActiveFilterCount() > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mainHeading}</h1>
                <p className="text-gray-600 mt-1">
                  {subHeading}
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