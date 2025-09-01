'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
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
      
      // Dummy properties data for now
      const dummyProperties = [
        {
          id: 1,
          type: 'new_project',
          project_name: 'The Greenfront',
          location: 'Hinjawadi, Pune',
          description: '2 & 3 BHK Apartment, 4 BHK Duplex for Sale in Hinjawadi, Pune',
          bhk_type: '2 & 3 BHK Apartment, 4 BHK Duplex',
          starting_price: 11600000, // 1.16 Cr
          price_per_sqft: 12290, // 12.29 K
          built_up_area: 'On request',
          carpet_area: '944 - 2,180 Sq.ft.',
          project_status: 'under_construction',
          developer_name: 'Greenfront Developers',
          amenities: ['parking', 'swimming-pool', 'lift', 'gated-community'],
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: true
        },
        {
          id: 2,
          type: 'new_project',
          project_name: 'Godrej Skyline',
          location: 'Koregaon Park, Pune',
          description: '3 & 4 BHK Apartment for Sale in Koregaon Park, Pune',
          bhk_type: '3 & 4 BHK Apartment',
          starting_price: 38900000, // 3.89 Cr
          price_per_sqft: 25930, // 25.93 K
          built_up_area: '1500 - 2400 Sq.ft.',
          carpet_area: 'On request',
          project_status: 'under_construction',
          developer_name: 'Godrej Properties',
          amenities: ['parking', 'swimming-pool', 'lift', 'gated-community', 'gas-pipeline'],
          images: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: true
        },
        {
          id: 3,
          type: 'new_project',
          project_name: 'Lodha Belmondo',
          location: 'Hinjewadi, Pune',
          description: '2, 3 & 4 BHK Luxury Apartments for Sale in Hinjewadi, Pune',
          bhk_type: '2, 3 & 4 BHK',
          starting_price: 8500000, // 85 Lacs
          price_per_sqft: 8500, // 8.5 K
          built_up_area: '1200 - 2800 Sq.ft.',
          carpet_area: '1100 - 2600 Sq.ft.',
          project_status: 'ready_to_move',
          developer_name: 'Lodha Group',
          amenities: ['parking', 'swimming-pool', 'lift', 'gated-community', 'gas-pipeline'],
          images: [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: false
        },
        {
          id: 4,
          type: 'resale',
          society_name: 'Prestige Shantiniketan',
          location: 'Baner, Pune',
          description: '3 BHK Apartment for Sale in Prestige Shantiniketan, Baner',
          bhk_type: '3 BHK',
          asking_price: 12500000, // 1.25 Cr
          price_per_sqft: 12500, // 12.5 K
          built_up_area: '1200 Sq.ft.',
          carpet_area: '1100 Sq.ft.',
          seller_name: 'Individual Owner',
          amenities: ['parking', 'lift', 'gated-community'],
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: true
        },
        {
          id: 5,
          type: 'new_project',
          project_name: 'Mahindra LifeSpaces',
          location: 'Kharadi, Pune',
          description: '2 & 3 BHK Apartments for Sale in Kharadi, Pune',
          bhk_type: '2 & 3 BHK',
          starting_price: 6500000, // 65 Lacs
          price_per_sqft: 6500, // 6.5 K
          built_up_area: '1000 - 1800 Sq.ft.',
          carpet_area: '900 - 1600 Sq.ft.',
          project_status: 'under_construction',
          developer_name: 'Mahindra Lifespaces',
          amenities: ['parking', 'swimming-pool', 'lift'],
          images: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: true
        },
        {
          id: 6,
          type: 'rental',
          society_name: 'Sunshine Residency',
          location: 'Viman Nagar, Pune',
          description: '2 BHK Apartment for Rent in Viman Nagar, Pune',
          bhk_type: '2 BHK',
          rent_amount: 25000, // 25K per month
          built_up_area: '1100 Sq.ft.',
          carpet_area: '1000 Sq.ft.',
          owner_name: 'Individual Owner',
          amenities: ['parking', 'lift'],
          images: [
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'
          ],
          created_at: new Date().toISOString(),
          offers_available: false
        }
      ];

      let allProperties = dummyProperties;

      // Apply search filter
      if (searchQuery) {
        allProperties = allProperties.filter(property => 
          property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.society_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.seller_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.owner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.developer_name?.toLowerCase().includes(searchQuery.toLowerCase())
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
              case '1year': return property.project_status === 'under_construction';
              case '2year': return property.project_status === 'under_construction';
              case '3year': return property.project_status === 'under_construction';
              default: return true;
            }
          });
        }
        return true;
      });
    }

    // Listed By filter
    if (selectedFilters.listedBy.length > 0) {
      filtered = filtered.filter(property => {
        if (selectedFilters.listedBy.includes('developer')) {
          return property.type === 'new_project';
        }
        return true;
      });
    }

    // Amenities filter
    if (selectedFilters.amenities.length > 0) {
      filtered = filtered.filter(property => 
        selectedFilters.amenities.some(amenity => 
          property.amenities?.includes(amenity)
        )
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
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Search and Filter Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 left-0 right-0 z-10">
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

            {/* Filters Button */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
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

                        

                  {/* Main Content - Layout with Sidebar */}
                  <div className="flex">
                    {/* Left Sidebar - Filters */}
                    <div className={`lg:w-80 lg:block ${showFilters ? 'block' : 'hidden'} bg-white border-r border-gray-200`}>
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
                  { value: '1_rk_1_bhk', label: '1 BHK' },
                  { value: '2_bhk', label: '2 BHK' },
                  { value: '3_bhk', label: '3 BHK' },
                  { value: '4_bhk', label: '4 BHK' },
                  { value: '5_bhk', label: '4+ BHK' }
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
                <h4 className="font-semibold text-gray-900">Purchase Type</h4>
              </div>
              <div className="space-y-2">
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
                  { value: '1year', label: 'In 1 Year' },
                  { value: '2year', label: 'In 2 Years' },
                  { value: '3year', label: 'In 3 Years' },
                  { value: 'after3year', label: 'After 3 Years' }
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
              </div>
            </div>

            {/* Age Of Property */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-900">Age Of Property</h4>
              </div>
              <div className="space-y-2">
                {[
                  { value: 'less-than-1', label: 'Less than a Year' },
                  { value: 'less-than-2', label: 'Less than 2 Years' },
                  { value: 'less-than-3', label: 'Less than 3 Years' },
                  { value: 'less-than-4', label: 'Less than 4 Years' }
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
                  { value: 'parking', label: 'Parking' },
                  { value: 'swimming-pool', label: 'Swimming Pool' },
                  { value: 'lift', label: 'Lift' },
                  { value: 'gated-community', label: 'Gated Community' },
                  { value: 'gas-pipeline', label: 'Gas Pipeline' }
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
        <div className="flex-1">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
