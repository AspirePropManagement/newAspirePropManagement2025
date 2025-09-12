'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardStats from '../../components/DashboardStats';
import PropertyBreakdown from '../../components/PropertyBreakdown';
import RecentActivity from '../../components/RecentActivity';
import UserColumn from '../../components/UserColumn';
import { PropertyCard } from '../../components/PropertyCard';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import DashboardPropertyForm from '../../components/DashboardPropertyForm';

/**
 * Main dashboard page displaying comprehensive property management statistics
 * Implements the Single Responsibility Principle by orchestrating dashboard components
 */
export default function DashboardPage() {
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
          description: prop.other_notes || prop.important_notes || '',
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
    <div className="min-h-screen bg-gray-50">
      <DashboardLayout onPropertyListingClick={() => setShowPropertyForm(true)}>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.first_name || user.email}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPropertyForm(true)}
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200 shadow-sm"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Post Property
              </button>
              <button
                onClick={refreshData}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Dashboard Statistics */}
          <DashboardStats stats={stats} isLoading={isLoading} />

          {/* Quick Actions Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-600 mt-1">Manage your properties and listings</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowPropertyForm(true)}
                className="group p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all duration-200 w-full text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <PlusIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-600">Post New Property</h3>
                    <p className="text-sm text-gray-500">Add resale, rental, or new project</p>
                  </div>
                </div>
              </button>
              
              <Link
                href="/properties-listing"
                className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600">View All Properties</h3>
                    <p className="text-sm text-gray-500">Browse and manage listings</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/profile"
                className="group p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-green-600">Manage Profile</h3>
                    <p className="text-sm text-gray-500">Update your account settings</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Property Breakdown and Recent Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PropertyBreakdown stats={stats} isLoading={isLoading} />
            <RecentActivity activities={stats?.recentActivity || []} isLoading={isLoading} />
          </div>

          {/* User Role Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UserColumn
              title="Buyers"
              users={stats?.usersByRole?.buyers || []}
              count={stats?.totalBuyers || 0}
              isLoading={isLoading}
              color="text-green-600"
              icon="👥"
            />

            <UserColumn
              title="Builders"
              users={stats?.usersByRole?.builders || []}
              count={stats?.totalBuilders || 0}
              isLoading={isLoading}
              color="text-orange-600"
              icon="🏗️"
            />

            <UserColumn
              title="Agents"
              users={stats?.usersByRole?.agents || []}
              count={stats?.totalAgents || 0}
              isLoading={isLoading}
              color="text-purple-600"
              icon="👨‍💼"
            />
          </div>

          {/* Recent Properties Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
                  <p className="text-sm text-gray-600 mt-1">Latest properties added to the platform</p>
                </div>
                <Link
                  href="/properties-listing"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Properties →
                </Link>
              </div>
            </div>

            <div className="p-6">
              {propertiesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : propertiesError ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Properties</h3>
                  <p className="text-gray-600">{propertiesError}</p>
                </div>
              ) : recentProperties.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Found</h3>
                  <p className="text-gray-600 mb-4">No properties have been added yet</p>
                  <Link
                    href="/post-property"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add First Property
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
      
      {/* Dashboard Property Form Modal */}
      <DashboardPropertyForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={() => {
          setShowPropertyForm(false);
          refreshData(); // Refresh dashboard data after successful property submission
        }}
      />
    </div>
  );
}
