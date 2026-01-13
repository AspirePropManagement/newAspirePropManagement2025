'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardStats from '../../components/DashboardStats';
import PropertyBreakdown from '../../components/PropertyBreakdown';
import UserColumn from '../../components/UserColumn';
import { PropertyCard } from '../../components/PropertyCard';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import DashboardPropertyForm from '../../components/DashboardPropertyForm';
import { ScrollArrow } from '../../components/ScrollArrow';

/**
 * Admin Dashboard page displaying comprehensive property management statistics
 * Implements the Single Responsibility Principle by orchestrating dashboard components
 */
export default function AdminDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { stats, analytics, isLoading: dataLoading, error, refreshData } = useDashboardData();
  const router = useRouter();
  
  // Property listing state
  const [recentProperties, setRecentProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);
  
  // Property form state
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  // Fetch recent properties
  useEffect(() => {
    const fetchRecentProperties = async () => {
      try {
        setPropertiesLoading(true);
        setPropertiesError(null);

        if (!supabase) {
          setPropertiesError('Database connection not available');
          return;
        }

        let allProperties: any[] = [];

        // Fetch from resale_properties table
        const { data: resaleData, error: resaleError } = await supabase
          .from('resale_properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (resaleError) throw resaleError;

        // Transform resale properties
        const transformedResale = (resaleData || []).map(prop => ({
          ...prop,
          title: `${prop.bhk_type?.replace('_', ' ').toUpperCase() || 'PROPERTY'} ${prop.property_type?.replace('_', ' ').toUpperCase() || 'APARTMENT'}`,
          description: prop.notes || '',
          price: prop.asking_price,
          type: 'resale',
          asking_price: prop.asking_price,
          bedrooms: prop.bhk_type?.includes('1') ? 1 : prop.bhk_type?.includes('2') ? 2 : prop.bhk_type?.includes('3') ? 3 : prop.bhk_type?.includes('4') ? 4 : 5,
          bathrooms: prop.bhk_type?.includes('1') ? 1 : prop.bhk_type?.includes('2') ? 2 : prop.bhk_type?.includes('3') ? 3 : prop.bhk_type?.includes('4') ? 4 : 5,
          square_feet: prop.square_feet,
          carpet_area: prop.carpet_area,
          images: prop.images || []
        }));

        allProperties = [...allProperties, ...transformedResale];

        // Fetch from rental_properties table
        const { data: rentalData, error: rentalError } = await supabase
          .from('rental_properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (rentalError) throw rentalError;

        // Transform rental properties
        const transformedRental = (rentalData || []).map(prop => ({
          ...prop,
          title: `${prop.bhk_type?.replace('_', ' ').toUpperCase() || 'PROPERTY'} ${prop.property_type?.replace('_', ' ').toUpperCase() || 'APARTMENT'}`,
          description: `Rental property in ${prop.location}`,
          price: prop.rent_amount,
          type: 'rental',
          rent_amount: prop.rent_amount,
          bedrooms: prop.bhk_type?.includes('1') ? 1 : prop.bhk_type?.includes('2') ? 2 : prop.bhk_type?.includes('3') ? 3 : prop.bhk_type?.includes('4') ? 4 : 5,
          bathrooms: prop.bhk_type?.includes('1') ? 1 : prop.bhk_type?.includes('2') ? 2 : prop.bhk_type?.includes('3') ? 3 : prop.bhk_type?.includes('4') ? 4 : 5,
          square_feet: null,
          carpet_area: null,
          images: prop.images || []
        }));

        allProperties = [...allProperties, ...transformedRental];

        // Fetch from new_projects table
        const { data: newProjectData, error: newProjectError } = await supabase
          .from('new_projects')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (newProjectError) throw newProjectError;

        // Transform new projects
        const transformedNewProjects = (newProjectData || []).map(prop => ({
          ...prop,
          title: prop.project_name || 'New Project',
          description: prop.project_description || '',
          price: 0,
          type: 'new_project',
          starting_price: 0,
          bedrooms: 0,
          bathrooms: 0,
          square_feet: null,
          carpet_area: null,
          location: prop.project_location,
          images: prop.images || []
        }));

        allProperties = [...allProperties, ...transformedNewProjects];

        // Sort by creation date and take the most recent 6
        allProperties.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRecentProperties(allProperties.slice(0, 6));

      } catch (err) {
        console.error('Error fetching recent properties:', err);
        setPropertiesError('Failed to load recent properties');
      } finally {
        setPropertiesLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchRecentProperties();
    }
  }, [isAuthenticated]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    router.push('/auth');
    return null;
  }

  const isLoading = authLoading || dataLoading;

  return (
    <DashboardLayout onPostPropertyClick={() => setShowPropertyForm(true)}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-6">
        <div className="w-full max-w-none px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Modern Page Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3 leading-tight">
              Welcome Back, {user.first_name || user.email}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-4 sm:mb-6 leading-relaxed px-2">
              Manage your properties, track analytics, and grow your real estate business
            </p>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Data
                </>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl sm:rounded-2xl flex items-center justify-center">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3 sm:ml-4">
                  <h3 className="text-base sm:text-lg font-semibold text-red-800">Error loading dashboard data</h3>
                  <p className="mt-1 text-sm sm:text-base text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-16 gap-4 sm:gap-6 max-w-7xl mx-auto">
            
            {/* Dashboard Statistics - Full Width */}
            <div className="lg:col-span-12 xl:col-span-16">
              <DashboardStats stats={stats} isLoading={isLoading} />
            </div>

            {/* Quick Actions - Large Tile */}
            <div className="lg:col-span-8 xl:col-span-11 bg-gradient-to-br from-white to-purple-50 rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100 p-4 sm:p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 -translate-y-12 sm:-translate-y-16 translate-x-12 sm:translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                    <svg className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
                    <p className="text-sm sm:text-base text-gray-600">Manage your properties and grow your business</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <button
                    onClick={() => setShowPropertyForm(true)}
                    className="group p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-orange-600 transition-colors shadow-lg">
                        <PlusIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors">Post New Property</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Add resale, rental, or new project</p>
                    </div>
                  </button>
                  
                  <Link
                    href="/properties-listing"
                    className="group p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-600 transition-colors shadow-lg">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">View All Properties</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Browse and manage listings</p>
                    </div>
                  </Link>

                  <Link
                    href="/profile"
                    className="group p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl border border-green-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-green-600 transition-colors shadow-lg">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors">Manage Profile</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Update account settings</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Property Breakdown - Medium Tile */}
            <div className="lg:col-span-4 xl:col-span-5">
              <PropertyBreakdown stats={stats} isLoading={dataLoading} />
            </div>


            {/* User Role Columns - Medium Tiles */}
            <div className="lg:col-span-4 xl:col-span-5">
              <UserColumn
                title="Buyers"
                users={stats?.usersByRole?.buyers || []}
                count={stats?.totalBuyers || 0}
                isLoading={isLoading}
                color="text-green-600"
                icon="👥"
              />
            </div>

            {/* Recent Properties Section - Full Width */}
            <div className="lg:col-span-12 xl:col-span-16 bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                      <svg className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Properties</h2>
                      <p className="text-sm sm:text-base text-gray-600">Latest properties added to the platform</p>
                    </div>
                  </div>
                  <Link
                    href="/properties-listing"
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                  >
                    View All Properties
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                {propertiesLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="bg-gray-200 rounded-xl sm:rounded-2xl h-40 sm:h-48 mb-3 sm:mb-4"></div>
                        <div className="space-y-2 sm:space-y-3">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-3/4"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-1/2"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : propertiesError ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Error Loading Properties</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{propertiesError}</p>
                    <button
                      onClick={refreshData}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base"
                    >
                      Try Again
                    </button>
                  </div>
                ) : recentProperties.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Start by adding your first property to the platform</p>
                    <button
                      onClick={() => setShowPropertyForm(true)}
                      className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                    >
                      <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Add First Property
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {recentProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Scroll Arrow */}
        <ScrollArrow />
      </div>
      
      {/* Dashboard Property Form Modal */}
      <DashboardPropertyForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={() => {
          setShowPropertyForm(false);
          refreshData(); // Refresh dashboard data after successful property submission
        }}
      />
    </DashboardLayout>
  );
}