'use client'

import React, { useState } from 'react'
import { useSupabase } from './SupabaseProvider'
import { useSupabaseUser } from '@/hooks/useSupabaseUser'
import { UserRole } from '@/types/Auth'

/**
 * Authentication Dashboard Component
 * Provides a unified interface for all authentication methods
 * Implements the Single Responsibility Principle by only handling authentication display
 */

export function AuthDashboard() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer')
  const { user: authUser, loading, signOut } = useSupabase()
  const { user, role, roleData, loading: userLoading } = useSupabaseUser()

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  if (authUser && user && !userLoading) {
    const userRole = role
    const isVerified = authUser.email_confirmed_at !== null

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user.full_name || 'User'}!</h1>
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Authenticated as {userRole}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-gray-900">{user.full_name || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Role:</span>
                <p className="text-gray-900 capitalize">{userRole}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Role Details:</span>
                <p className="text-gray-900">
                  {roleData ? (
                    role === 'admin' ? `Admin Level: ${(roleData as any).admin_level || 'Standard'}` :
                    role === 'agent' ? `License: ${(roleData as any).license_number || 'Not provided'}` :
                    role === 'buyer' ? `Budget: $${(roleData as any).budget_min || '0'} - $${(roleData as any).budget_max || 'Unlimited'}` :
                    role === 'builder' ? `Company: ${(roleData as any).company_name || 'Not provided'}` :
                    'No additional details'
                  ) : 'Loading role details...'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${isVerified ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                  <span className="text-gray-900">{isVerified ? 'Verified' : 'Pending Verification'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {/* TODO: Implement profile edit */}}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => {/* TODO: Implement password change */}}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Change Password
              </button>
              <button
                onClick={signOut}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Role Selection */}
      <div className="max-w-md mx-auto mb-8">
        <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select User Role
        </label>
        <select
          id="role-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="buyer">Buyer - Looking to buy properties</option>
          <option value="agent">Agent - Real estate agent or broker</option>
          <option value="builder">Builder - Property developer or builder</option>
          <option value="admin">Admin - System administrator</option>
        </select>
      </div>

      {/* Authentication Redirect */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Started with Aspire Property Management</h2>
        <p className="text-gray-600 mb-6">Choose your role and create an account to access our platform</p>
        <div className="flex justify-center space-x-4">
          <a
            href="/auth"
            className="bg-orange-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Sign Up Now
          </a>
          <a
            href="/auth"
            className="border border-orange-500 text-orange-500 px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
          <p className="text-gray-600">Enterprise-grade authentication with Supabase security</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
          <p className="text-gray-600">Different user roles with appropriate permissions</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Updates</h3>
          <p className="text-gray-600">Live data synchronization and updates</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern UI/UX</h3>
          <p className="text-gray-600">Beautiful and intuitive user interface</p>
        </div>
      </div>
    </div>
  )
}
