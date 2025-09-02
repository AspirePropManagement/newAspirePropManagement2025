'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * FilterCard component for property search
 * Positioned to overlay both hero carousel and features sections
 * Supports filtering for New Projects, Rental Properties, and Resale Properties
 */
export const FilterCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new-projects' | 'rental' | 'resale'>('new-projects');
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    bhkType: '',
    budget: '',
    constructionType: '',
    furnishingType: '',
    priceRange: '',
    amenities: [] as string[]
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getSearchUrl = () => {
    const baseUrl = '/properties-listing';
    const params = new URLSearchParams();
    
    params.set('type', activeTab);
    if (filters.location) params.set('location', filters.location);
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.bhkType) params.set('bhkType', filters.bhkType);
    if (filters.budget) params.set('budget', filters.budget);
    if (filters.constructionType) params.set('constructionType', filters.constructionType);
    if (filters.furnishingType) params.set('furnishingType', filters.furnishingType);
    if (filters.priceRange) params.set('priceRange', filters.priceRange);
    
    return `${baseUrl}?${params.toString()}`;
  };

  const renderNewProjectsFilters = () => (
    <>
      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <select 
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Location</option>
          <option value="hinjawadi">Hinjawadi</option>
          <option value="koregaon-park">Koregaon Park</option>
          <option value="kharadi">Kharadi</option>
          <option value="baner">Baner</option>
          <option value="wakad">Wakad</option>
          <option value="pune">Pune</option>
        </select>
      </div>

      {/* Project Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Project Type</label>
        <select 
          value={filters.propertyType}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Type</option>
          <option value="residence">Residence</option>
          <option value="gated_community_villa_or_bungalow">Gated Community/Villa/Bungalow</option>
          <option value="commercial">Commercial</option>
          <option value="land_or_plot">Land/Plot</option>
        </select>
      </div>

      {/* Construction Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Construction Status</label>
        <select 
          value={filters.constructionType}
          onChange={(e) => handleFilterChange('constructionType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Status</option>
          <option value="new_launching">New Launching</option>
          <option value="under_construction">Under Construction</option>
          <option value="ready_to_move">Ready to Move</option>
        </select>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Budget Range</label>
        <select 
          value={filters.budget}
          onChange={(e) => handleFilterChange('budget', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Budget</option>
          <option value="under-50">Under 50 Lacs</option>
          <option value="50-75">50 Lacs - 75 Lacs</option>
          <option value="75-1cr">75 Lacs - 1 Crore</option>
          <option value="1-2cr">1 Crore - 2 Crore</option>
          <option value="2-5cr">2 Crore - 5 Crore</option>
          <option value="above-5cr">Above 5 Crore</option>
        </select>
      </div>
    </>
  );

  const renderRentalFilters = () => (
    <>
      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <select 
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Location</option>
          <option value="hinjawadi">Hinjawadi</option>
          <option value="koregaon-park">Koregaon Park</option>
          <option value="kharadi">Kharadi</option>
          <option value="baner">Baner</option>
          <option value="wakad">Wakad</option>
          <option value="pune">Pune</option>
        </select>
      </div>

      {/* BHK Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">BHK Type</label>
        <select 
          value={filters.bhkType}
          onChange={(e) => handleFilterChange('bhkType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select BHK</option>
          <option value="1_rk_1_bhk">1 RK / 1 BHK</option>
          <option value="2_bhk">2 BHK</option>
          <option value="3_bhk">3 BHK</option>
          <option value="4_bhk">4 BHK</option>
          <option value="5_bhk">5 BHK</option>
          <option value="5_plus_bhk">5+ BHK</option>
        </select>
      </div>

      {/* Furnishing Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Furnishing</label>
        <select 
          value={filters.furnishingType}
          onChange={(e) => handleFilterChange('furnishingType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Furnishing</option>
          <option value="fully_furnished">Fully Furnished</option>
          <option value="semi_furnished">Semi Furnished</option>
          <option value="un_furnished">Unfurnished</option>
        </select>
      </div>

      {/* Rent Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rent Range</label>
        <select 
          value={filters.priceRange}
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Rent Range</option>
          <option value="under-15k">Under ₹15,000</option>
          <option value="15k-25k">₹15,000 - ₹25,000</option>
          <option value="25k-40k">₹25,000 - ₹40,000</option>
          <option value="40k-60k">₹40,000 - ₹60,000</option>
          <option value="60k-1lac">₹60,000 - ₹1,00,000</option>
          <option value="above-1lac">Above ₹1,00,000</option>
        </select>
      </div>
    </>
  );

  const renderResaleFilters = () => (
    <>
      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <select 
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Location</option>
          <option value="hinjawadi">Hinjawadi</option>
          <option value="koregaon-park">Koregaon Park</option>
          <option value="kharadi">Kharadi</option>
          <option value="baner">Baner</option>
          <option value="wakad">Wakad</option>
          <option value="pune">Pune</option>
        </select>
      </div>

      {/* BHK Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">BHK Type</label>
        <select 
          value={filters.bhkType}
          onChange={(e) => handleFilterChange('bhkType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select BHK</option>
          <option value="1_rk_1_bhk">1 RK / 1 BHK</option>
          <option value="2_bhk">2 BHK</option>
          <option value="3_bhk">3 BHK</option>
          <option value="4_bhk">4 BHK</option>
          <option value="5_bhk">5 BHK</option>
          <option value="5_plus_bhk">5+ BHK</option>
        </select>
      </div>

      {/* Furnishing Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Furnishing</label>
        <select 
          value={filters.furnishingType}
          onChange={(e) => handleFilterChange('furnishingType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Furnishing</option>
          <option value="fully_furnished">Fully Furnished</option>
          <option value="semi_furnished">Semi Furnished</option>
          <option value="un_furnished">Unfurnished</option>
        </select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Price Range</label>
        <select 
          value={filters.priceRange}
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Price Range</option>
          <option value="under-50lac">Under ₹50 Lacs</option>
          <option value="50lac-1cr">₹50 Lacs - ₹1 Crore</option>
          <option value="1cr-2cr">₹1 Crore - ₹2 Crore</option>
          <option value="2cr-5cr">₹2 Crore - ₹5 Crore</option>
          <option value="above-5cr">Above ₹5 Crore</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-[95%] md:w-[90%] lg:w-[80%] max-w-5xl z-50">
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 animate-slide-up"
        style={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 12px 30px rgba(0,0,0,0.25)'
        }}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Your Perfect Property</h2>
          <p className="text-gray-600">Search from thousands of properties across the city</p>
        </div>

        {/* Property Type Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setActiveTab('new-projects')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'new-projects'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              New Projects
            </button>
            <button
              onClick={() => setActiveTab('rental')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'rental'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Rental
            </button>
            <button
              onClick={() => setActiveTab('resale')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'resale'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resale
            </button>
          </div>
        </div>
        
        {/* Desktop Layout - Horizontal */}
        <div className="hidden lg:grid grid-cols-5 gap-4 mb-6">
          {activeTab === 'new-projects' && renderNewProjectsFilters()}
          {activeTab === 'rental' && renderRentalFilters()}
          {activeTab === 'resale' && renderResaleFilters()}
          
          {/* Search Button */}
          <div className="space-y-2 flex flex-col">
            <label className="block text-sm font-medium text-gray-700 opacity-0 h-[20px]">Search</label>
            <Link href={getSearchUrl()} className="flex items-end">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[42px] flex items-center justify-center">
                Search
              </button>
            </Link>
          </div>
        </div>

        {/* Tablet Layout - Grid 2x3 */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 mb-6">
          {activeTab === 'new-projects' && (
            <>
              {renderNewProjectsFilters()}
              <div className="space-y-2 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 opacity-0 h-[20px]">Search</label>
                <Link href={getSearchUrl()} className="flex items-end">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[42px] flex items-center justify-center">
                    Search
                  </button>
                </Link>
              </div>
            </>
          )}
          {activeTab === 'rental' && (
            <>
              {renderRentalFilters()}
              <div className="space-y-2 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 opacity-0 h-[20px]">Search</label>
                <Link href={getSearchUrl()} className="flex items-end">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[42px] flex items-center justify-center">
                    Search
                  </button>
                </Link>
              </div>
            </>
          )}
          {activeTab === 'resale' && (
            <>
              {renderResaleFilters()}
              <div className="space-y-2 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 opacity-0 h-[20px]">Search</label>
                <Link href={getSearchUrl()} className="flex items-end">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[42px] flex items-center justify-center">
                    Search
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Mobile Layout - Vertical */}
        <div className="md:hidden space-y-4 mb-6">
          {activeTab === 'new-projects' && renderNewProjectsFilters()}
          {activeTab === 'rental' && renderRentalFilters()}
          {activeTab === 'resale' && renderResaleFilters()}
          
          <div className="pt-2">
            <Link href={getSearchUrl()}>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
                Search Properties
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
