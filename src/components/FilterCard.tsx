'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ToastContainer';
import GooglePlacesAutocomplete from './GooglePlacesAutocomplete';

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

  // Toast utilities
  const { toasts, showInfo, removeToast } = useToast();

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

  const hasAnyFilterSelected = () => {
    return Boolean(
      filters.location ||
      filters.propertyType ||
      filters.bhkType ||
      filters.budget ||
      filters.constructionType ||
      filters.furnishingType ||
      filters.priceRange ||
      (filters.amenities && filters.amenities.length > 0)
    );
  };

  const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasAnyFilterSelected()) {
      e.preventDefault();
      showInfo('Please select a location or at least one filter before searching.');
    }
  };

  const renderNewProjectsFilters = () => (
    <>
      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <GooglePlacesAutocomplete
          value={filters.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Search location (e.g., Pune, Maharashtra)"
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        />
      </div>

      {/* Project Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Project Type</label>
        <select 
          value={filters.propertyType}
          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
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
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
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
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Budget</option>
          <option value="under-40">Under 40 Lacs</option>
          <option value="40-70">40 Lacs - 70 Lacs</option>
          <option value="70-100">70 Lacs - 1 Crore</option>
          <option value="100-200">1 Crore - 2 Crore</option>
          <option value="above-200">Above 2 Crore</option>
        </select>
      </div>
    </>
  );

  const renderRentalFilters = () => (
    <>
      {/* Location */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <GooglePlacesAutocomplete
          value={filters.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Search location (e.g., Pune, Maharashtra)"
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        />
      </div>

      {/* BHK Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">BHK Type</label>
        <select 
          value={filters.bhkType}
          onChange={(e) => handleFilterChange('bhkType', e.target.value)}
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select BHK</option>
          <option value="1_rk">1 RK</option>
          <option value="1_bhk">1 BHK</option>
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
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
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
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
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
        <GooglePlacesAutocomplete
          value={filters.location}
          onChange={(value) => handleFilterChange('location', value)}
          placeholder="Search location (e.g., Pune, Maharashtra)"
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        />
      </div>

      {/* BHK Type */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">BHK Type</label>
        <select 
          value={filters.bhkType}
          onChange={(e) => handleFilterChange('bhkType', e.target.value)}
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select BHK</option>
          <option value="1_rk">1 RK</option>
          <option value="1_bhk">1 BHK</option>
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
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
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
          className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
        >
          <option value="">Select Price Range</option>
          <option value="under-40">Under ₹40 Lacs</option>
          <option value="40-70">₹40 Lacs - ₹70 Lacs</option>
          <option value="70-100">₹70 Lacs - ₹1 Crore</option>
          <option value="100-200">₹1 Crore - ₹2 Crore</option>
          <option value="above-200">Above ₹2 Crore</option>
        </select>
      </div>
    </>
  );

  return (
    <div className="w-full md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-7xl mx-auto px-4">
      <div 
        className="bg-white rounded-2xl shadow-2xl p-6 animate-slide-up relative"
        style={{
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* AI Technology button (top-left) */}
        <button
          onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new Event('open-chatbot'))}
          className="absolute top-2 left-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-orange-200 text-orange-600 hover:text-orange-700 group"
          title="Chat with Kriti"
          aria-label="Open AI Assistant"
        >
          {/* Inline SVG from ai-technology.svg with currentColor fill */}
          <svg aria-hidden="true" className="w-6 h-6 text-current group-hover:animate-[spin_1.2s_linear_infinite]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="m10.708 10.955.63 2.045h-1.274zm11.889 7.655c-.596.902-1.746 1.369-3.353 1.369-.293 0-.602-.016-.924-.047-.275-.026-.477-.271-.45-.545.027-.276.275-.475.546-.45 1.684.163 2.866-.15 3.347-.878.257-.39.318-.904.182-1.529-.392-1.795-2.301-4.138-5.002-6.266.576 4.531-.944 13.737-4.944 13.737-1.101 0-2.128-.779-2.971-2.251-.138-.24-.055-.545.186-.683.236-.138.544-.055.682.186.457.798 1.192 1.749 2.104 1.749 1.491 0 3.113-2.815 3.734-7.18-3.01 2.159-7.911 4.236-10.974 4.179-1.311.025-2.821-.387-3.42-1.489-.638-1.108-.383-2.635.735-4.417.149-.234.46-.301.689-.157.234.147.305.456.158.689-.897 1.427-1.151 2.629-.716 3.385.232.405.665.69 1.284.848 1.69.433 4.441-.144 7.382-1.455-.609-.331-1.291-.713-1.763-1.006-4.307-2.682-7.461-6.102-8.032-8.715-.196-.898-.087-1.67.325-2.293.722-1.09 2.246-1.542 4.405-1.309.274.03.473.276.443.551-.029.275-.277.475-.551.443-1.739-.189-2.97.12-3.464.867-.257.389-.318.903-.182 1.528.392 1.795 2.3 4.138 5.002 6.266-.574-4.533 1.362-14.073 4.945-13.737 1.1 0 2.127.778 2.969 2.25 0 0 0 0 .001.001.366.638.688 1.401.967 2.261 2.684-.628 5.249-1.086 6.722.977.651 1.133.373 2.698-.806 4.525-.15.234-.463.297-.69.149-.232-.15-.3-.459-.149-.691.948-1.471 1.225-2.708.778-3.485-.232-.404-.665-.689-1.284-.848-1.689-.429-4.434.143-7.37 1.45.59.324 1.256.704 1.751 1.011 4.31 2.681 7.463 6.102 8.034 8.714.196.898.087 1.67-.325 2.293zm-14.331-10.43c.366-.246.721-.502 1.099-.733 1.903-1.165 3.824-2.047 5.61-2.635-.256-.784-.544-1.489-.872-2.062 0 0 0 0 0-.001-.645-1.127-1.391-1.747-2.102-1.747-1.491 0-3.113 2.815-3.734 7.18zm4.535 6.173-1.518-4.932c-.077-.25-.308-.421-.57-.421-.26 0-.491.169-.569.417l-1.552 4.933c-.101.322.139.65.477.65.218 0 .411-.142.477-.35l.205-.65h1.896l.199.647c.065.21.258.353.478.353.336 0 .577-.325.478-.647zm2.199-4.853c0-.276-.224-.5-.5-.5s-.5.224-.5.5v5c0 .276.224.5.5.5s.5-.224.5-.5z"/>
          </svg>
        </button>

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
        <div className="hidden lg:block mb-6">
          {activeTab === 'new-projects' ? (
            <div className="grid grid-cols-4 gap-4">
              {/* First row: Wide Location (spans 3 columns) */}
              <div className="col-span-3 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <GooglePlacesAutocomplete
                  value={filters.location}
                  onChange={(value) => handleFilterChange('location', value)}
                  placeholder="Search location (e.g., Pune, Maharashtra)"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                />
              </div>

              {/* Search button spanning two rows, vertically centered */}
              <div className="row-span-2 flex items-center justify-center my-auto">
                <Link href={getSearchUrl()} className="w-full">
                  <button onClick={handleSearchClick} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[56px] flex items-center justify-center">
                    Search
                  </button>
                </Link>
              </div>

              {/* Second row: 3 selects */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Project Type</label>
                <select 
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select Type</option>
                  <option value="residence">Residence</option>
                  <option value="gated_community_villa_or_bungalow">Gated Community/Villa/Bungalow</option>
                  <option value="commercial">Commercial</option>
                  <option value="land_or_plot">Land/Plot</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Construction Status</label>
                <select 
                  value={filters.constructionType}
                  onChange={(e) => handleFilterChange('constructionType', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select Status</option>
                  <option value="new_launching">New Launching</option>
                  <option value="under_construction">Under Construction</option>
                  <option value="ready_to_move">Ready to Move</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Budget Range</label>
                <select 
                  value={filters.budget}
                  onChange={(e) => handleFilterChange('budget', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select Budget</option>
                  <option value="under-40">Under 40 Lacs</option>
                  <option value="40-70">40 Lacs - 70 Lacs</option>
                  <option value="70-100">70 Lacs - 1 Crore</option>
                  <option value="100-200">1 Crore - 2 Crore</option>
                  <option value="above-200">Above 2 Crore</option>
                </select>
              </div>
            </div>
          ) : activeTab === 'rental' ? (
            <div className="grid grid-cols-4 gap-4">
              {/* First row: Wide Location (spans 3 columns) */}
              <div className="col-span-3 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <GooglePlacesAutocomplete
                  value={filters.location}
                  onChange={(value) => handleFilterChange('location', value)}
                  placeholder="Search location (e.g., Pune, Maharashtra)"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                />
              </div>

              {/* Search button spanning two rows, vertically centered */}
              <div className="row-span-2 flex items-center justify-center my-auto">
                <Link href={getSearchUrl()} className="w-full">
                  <button onClick={handleSearchClick} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[56px] flex items-center justify-center">
                    Search
                  </button>
                </Link>
              </div>

              {/* Second row: 3 selects */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">BHK Type</label>
                <select 
                  value={filters.bhkType}
                  onChange={(e) => handleFilterChange('bhkType', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select BHK</option>
                  <option value="1_rk">1 RK</option>
                  <option value="1_bhk">1 BHK</option>
                  <option value="2_bhk">2 BHK</option>
                  <option value="3_bhk">3 BHK</option>
                  <option value="4_bhk">4 BHK</option>
                  <option value="5_bhk">5 BHK</option>
                  <option value="5_plus_bhk">5+ BHK</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Furnishing</label>
                <select 
                  value={filters.furnishingType}
                  onChange={(e) => handleFilterChange('furnishingType', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select Furnishing</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="un_furnished">Unfurnished</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rent Range</label>
                <select 
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
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
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {/* First row: Wide Location (spans 3 columns) */}
              <div className="col-span-3 space-y-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <GooglePlacesAutocomplete
                  value={filters.location}
                  onChange={(value) => handleFilterChange('location', value)}
                  placeholder="Search location (e.g., Pune, Maharashtra)"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                />
              </div>

              {/* Search button spanning two rows, vertically centered */}
              <div className="row-span-2 flex items-center justify-center my-auto">
                <Link href={getSearchUrl()} className="w-full">
                  <button onClick={handleSearchClick} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[56px] flex items-center justify-center">
                    Search
                  </button>
                </Link>
              </div>

              {/* Second row: 3 selects */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">BHK Type</label>
                <select 
                  value={filters.bhkType}
                  onChange={(e) => handleFilterChange('bhkType', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select BHK</option>
                  <option value="1_rk">1 RK</option>
                  <option value="1_bhk">1 BHK</option>
                  <option value="2_bhk">2 BHK</option>
                  <option value="3_bhk">3 BHK</option>
                  <option value="4_bhk">4 BHK</option>
                  <option value="5_bhk">5 BHK</option>
                  <option value="5_plus_bhk">5+ BHK</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Furnishing</label>
                <select 
                  value={filters.furnishingType}
                  onChange={(e) => handleFilterChange('furnishingType', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select Furnishing</option>
                  <option value="fully_furnished">Fully Furnished</option>
                  <option value="semi_furnished">Semi Furnished</option>
                  <option value="un_furnished">Unfurnished</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <select 
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 h-[42px]"
                >
                  <option value="">Select Price Range</option>
                  <option value="under-40">Under ₹40 Lacs</option>
                  <option value="40-70">₹40 Lacs - ₹70 Lacs</option>
                  <option value="70-100">₹70 Lacs - ₹1 Crore</option>
                  <option value="100-200">₹1 Crore - ₹2 Crore</option>
                  <option value="above-200">Above ₹2 Crore</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Tablet Layout - Grid 2x3 */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 mb-6">
          {activeTab === 'new-projects' && (
            <>
              {renderNewProjectsFilters()}
              <div className="space-y-2 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 opacity-0 h-[20px]">Search</label>
                <Link href={getSearchUrl()} className="flex items-end">
                  <button onClick={handleSearchClick} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[42px] flex items-center justify-center">
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
                  <button onClick={handleSearchClick} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg h-[42px] flex items-center justify-center">
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
              <button onClick={handleSearchClick} className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
                Search Properties
              </button>
            </Link>
          </div>
        </div>
        {/* Toasts */}
        <ToastContainer toasts={toasts as any} onRemove={removeToast} />
      </div>
    </div>
  );
};
