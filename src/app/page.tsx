'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';


export default function HomePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  useEffect(() => {
    // Debug information
    if (loading) {
      setDebugInfo('Loading authentication state...');
    } else if (isAuthenticated) {
      setDebugInfo(`Authenticated as: ${user?.email || 'Unknown'}`);
    } else {
      setDebugInfo('Not authenticated');
    }
  }, [loading, isAuthenticated, user]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
            <p className="text-sm text-gray-500">{debugInfo}</p>
          </div>
          
          {/* Debug Information */}
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm max-w-md mx-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Loading: {loading ? 'true' : 'false'}</p>
              <p>Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
              <p>User: {user ? 'exists' : 'null'}</p>
              <p>Environment: {process.env.NODE_ENV}</p>
              <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}</p>
              <p>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}</p>
            </div>
          </div>
          

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to{' '}
            <span className="text-orange-500">Aspire Property Management</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in premium property management and real estate services. 
            Discover exceptional properties and professional management solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="bg-white hover:bg-gray-50 text-orange-500 border-2 border-orange-500 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Property Management</h3>
            <p className="text-gray-600">Professional management services for property owners and investors.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Quality Assurance</h3>
            <p className="text-gray-600">Rigorous quality standards ensure the best properties and services.</p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Expert Support</h3>
            <p className="text-gray-600">Dedicated support team available to assist you every step of the way.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
