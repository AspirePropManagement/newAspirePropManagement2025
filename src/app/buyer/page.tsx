'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardPropertyForm from '@/components/DashboardPropertyForm'
import Link from 'next/link'
import { HeartIcon, EyeIcon, ShareIcon } from '@heroicons/react/24/outline'

interface PropertyStats {
  totalFavorites: number
  viewedProperties: number
  savedSearches: number
  inquiriesSent: number
}

interface FavoriteProperty {
  id: string
  title: string
  location: string
  price: number
  type: 'resale' | 'rental' | 'new_project'
  created_at: string
  images?: string[]
}

/**
 * Buyer Dashboard - Shows buyer's favorites, viewed properties, and saved searches
 */
export default function BuyerDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [stats, setStats] = useState<PropertyStats>({
    totalFavorites: 0,
    viewedProperties: 0,
    savedSearches: 0,
    inquiriesSent: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch buyer's data
  useEffect(() => {
    const fetchBuyerData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)

        // For now, we'll simulate some data since we don't have favorites table yet
        // In a real app, you would fetch from favorites, viewed_properties, saved_searches tables
        
        // Simulate some favorite properties
        const mockFavorites: FavoriteProperty[] = [
          {
            id: '1',
            title: '2 BHK APARTMENT',
            location: 'Pune, Maharashtra',
            price: 4500000,
            type: 'resale',
            created_at: new Date().toISOString(),
            images: []
          },
          {
            id: '2',
            title: '3 BHK APARTMENT',
            location: 'Mumbai, Maharashtra',
            price: 8500000,
            type: 'resale',
            created_at: new Date().toISOString(),
            images: []
          }
        ]

        setFavorites(mockFavorites)

        // Calculate statistics
        const stats: PropertyStats = {
          totalFavorites: mockFavorites.length,
          viewedProperties: 12, // Mock data
          savedSearches: 3, // Mock data
          inquiriesSent: 8 // Mock data
        }
        setStats(stats)

      } catch (err) {
        console.error('Error fetching buyer data:', err)
        setError('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && user) {
      fetchBuyerData()
    }
  }, [user, isAuthenticated])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`
    }
    return `₹${price.toLocaleString()}`
  }

  return (
    <DashboardLayout onPostPropertyClick={() => setShowPropertyForm(true)}>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.first_name || 'Buyer'}! Track your property search and favorites.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Favorites</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <EyeIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Viewed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.viewedProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Searches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.savedSearches}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inquiriesSent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/properties-listing"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Search Properties</h3>
                  <p className="text-gray-600">Find your perfect home</p>
                </div>
              </div>
            </Link>

            <Link
              href="/favorites"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">My Favorites</h3>
                  <p className="text-gray-600">View saved properties</p>
                </div>
              </div>
            </Link>

            <Link
              href="/contact"
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">Get Help</h3>
                  <p className="text-gray-600">Contact our team</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Favorites List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Favorites</h2>
                <Link
                  href="/properties-listing"
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Browse More Properties
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading favorites...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  >
                    Try Again
                  </button>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-8">
                  <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No favorites yet</p>
                  <Link
                    href="/properties-listing"
                    className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    Start Browsing Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-gray-600">{property.location}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(property.price)}
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                              {property.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              Added {new Date(property.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <ShareIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-400 hover:text-red-600">
                            <HeartIcon className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Property Form Modal */}
      <DashboardPropertyForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={() => {
          setShowPropertyForm(false);
        }}
      />
    </DashboardLayout>
  )
}