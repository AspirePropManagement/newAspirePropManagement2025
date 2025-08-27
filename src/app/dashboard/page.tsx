'use client';

import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import DashboardStats from '../../components/DashboardStats';
import PropertyBreakdown from '../../components/PropertyBreakdown';
import RecentActivity from '../../components/RecentActivity';
import UserColumn from '../../components/UserColumn';
import { useAuth } from '../../hooks/useAuth';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useRouter } from 'next/navigation';

/**
 * Main dashboard page displaying comprehensive property management statistics
 * Implements the Single Responsibility Principle by orchestrating dashboard components
 */
export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { stats, analytics, isLoading: dataLoading, error, refreshData } = useDashboardData();
  const router = useRouter();

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
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.first_name || user.email}</p>
            </div>
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
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
        </div>
      </DashboardLayout>
    </div>
  );
}
