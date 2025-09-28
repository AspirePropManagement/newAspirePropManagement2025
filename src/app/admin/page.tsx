'use client';

import React, { useState } from 'react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { InlinePreloader } from '@/components/Preloader';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardPropertyForm from '@/components/DashboardPropertyForm';
import Link from 'next/link';

/**
 * Admin Dashboard page - shows overview of all users and quick navigation
 */
export default function AdminDashboardPage() {
  const { users: allUsers, loading, error } = useUserManagement();
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const getUsersByRole = (role: string) => {
    return allUsers.filter(user => user.role === role);
  };

  const getActiveUsersByRole = (role: string) => {
    return allUsers.filter(user => user.role === role && user.is_active);
  };

  const stats = {
    total: allUsers.length,
    admins: getUsersByRole('ADMIN').length,
    agents: getUsersByRole('AGENT').length,
    buyers: getUsersByRole('BUYER').length,
    builders: getUsersByRole('BUILDER').length,
    activeAdmins: getActiveUsersByRole('ADMIN').length,
    activeAgents: getActiveUsersByRole('AGENT').length,
    activeBuyers: getActiveUsersByRole('BUYER').length,
    activeBuilders: getActiveUsersByRole('BUILDER').length,
  };

  if (loading) {
    return (
      <DashboardLayout onPropertyListingClick={() => setShowPropertyForm(true)}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">System overview and user management</p>
          </div>
          <InlinePreloader text="Loading dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout onPropertyListingClick={() => setShowPropertyForm(true)}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout onPropertyListingClick={() => setShowPropertyForm(true)}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 py-6">
        <div className="w-full max-w-none px-6 lg:px-8">
          {/* Modern Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete system overview and user management control center
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-16 gap-6 max-w-7xl mx-auto">
            
            {/* Stats Overview - Full Width */}
            <div className="lg:col-span-12 xl:col-span-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-blue-100 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      <div className="text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {stats.total}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Total Users</h3>
                    <p className="text-gray-600">All registered users in the system</p>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-white to-green-50 p-8 rounded-3xl shadow-xl border border-green-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-green-100 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="text-4xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        {stats.activeAdmins + stats.activeAgents + stats.activeBuyers + stats.activeBuilders}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Active Users</h3>
                    <p className="text-gray-600">Currently active user accounts</p>
                  </div>
                </div>

                <div className="group bg-gradient-to-br from-white to-purple-50 p-8 rounded-3xl shadow-xl border border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -translate-y-12 translate-x-12"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-4 bg-purple-100 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="text-4xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">
                        0
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Properties</h3>
                    <p className="text-gray-600">Total property listings</p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Management Cards - Bento Grid */}
            <Link href="/admin/agents" className="lg:col-span-6 xl:col-span-8 block group">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="px-4 py-2 bg-blue-100 text-blue-600 font-semibold rounded-full text-sm group-hover:bg-blue-200 transition-colors">Manage</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Agents</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-blue-600">{stats.agents}</div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{stats.activeAgents} active</p>
                        <p className="text-xs text-gray-400">Property specialists</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/buyers" className="lg:col-span-6 xl:col-span-8 block group">
              <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl border border-green-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-green-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-600 font-semibold rounded-full text-sm group-hover:bg-green-200 transition-colors">Manage</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Buyers</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-green-600">{stats.buyers}</div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{stats.activeBuyers} active</p>
                        <p className="text-xs text-gray-400">Property seekers</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/builders" className="lg:col-span-6 xl:col-span-8 block group">
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl border border-purple-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-purple-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="px-4 py-2 bg-purple-100 text-purple-600 font-semibold rounded-full text-sm group-hover:bg-purple-200 transition-colors">Manage</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Builders</h3>
                    <div className="flex items-center justify-between">
                      <div className="text-4xl font-bold text-purple-600">{stats.builders}</div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{stats.activeBuilders} active</p>
                        <p className="text-xs text-gray-400">Construction companies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <div className="lg:col-span-6 xl:col-span-8 bg-gradient-to-br from-white to-red-50 rounded-3xl shadow-xl border border-red-100 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200 to-pink-200 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-red-500 rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-full text-sm">System</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Admins</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-bold text-red-600">{stats.admins}</div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{stats.activeAdmins} active</p>
                      <p className="text-xs text-gray-400">System administrators</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      
      {/* Dashboard Property Form Modal */}
      <DashboardPropertyForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={() => {
          setShowPropertyForm(false);
          // Optionally refresh data here if needed
        }}
      />
    </DashboardLayout>
  );
}
