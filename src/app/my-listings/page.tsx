'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardPropertyForm from '@/components/DashboardPropertyForm';
import PropertyListingsTable from '@/components/PropertyListingsTable';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * My Listings Page
 * Displays all property listings for the current user
 */
export default function MyListingsPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardLayout onPostPropertyClick={() => setShowPropertyForm(true)}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Listings
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage all your property listings in one place
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <PropertyListingsTable />
        </div>
      </div>

      {/* Property Form Modal */}
      <DashboardPropertyForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={() => {
          setShowPropertyForm(false);
          // Refresh the page to show new listings
          window.location.reload();
        }}
      />
    </DashboardLayout>
  );
}

