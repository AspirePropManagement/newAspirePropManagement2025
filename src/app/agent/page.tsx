'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import Link from 'next/link'
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface PropertyStats {
  totalProperties: number
  resaleProperties: number
  rentalProperties: number
  newProjects: number
  availableProperties: number
  soldProperties: number
  pendingProperties: number
}

interface Property {
  id: string
  title: string
  location: string
  price: number
  status: string
  type: 'resale' | 'rental' | 'new_project'
  created_at: string
  images?: string[]
}

/**
 * Agent Dashboard - Shows agent's listed properties and statistics
 */
export default function AgentDashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [properties, setProperties] = useState<Property[]>([])
  const [stats, setStats] = useState<PropertyStats>({
    totalProperties: 0,
    resaleProperties: 0,
    rentalProperties: 0,
    newProjects: 0,
    availableProperties: 0,
    soldProperties: 0,
    pendingProperties: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch agent's properties
  useEffect(() => {
    const fetchAgentProperties = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)

        if (!supabase) {
          setError('Database connection not available')
          setLoading(false)
          return
        }

        // Fetch resale properties
        const { data: resaleData, error: resaleError } = await supabase
          .from('resale_properties')
          .select('id, property_type, bhk_type, location, asking_price, status, created_at, images')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        if (resaleError) throw resaleError

        // Fetch rental properties
        const { data: rentalData, error: rentalError } = await supabase
          .from('rental_properties')
          .select('id, property_type, bhk_type, location, rent_amount, status, created_at, images')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        if (rentalError) throw rentalError

        // Fetch new projects
        const { data: projectData, error: projectError } = await supabase
          .from('new_projects')
          .select('id, project_name, project_location, starting_price, status, created_at, images')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        if (projectError) throw projectError

        // Transform and combine data
        const resaleProperties = (resaleData || []).map(prop => ({
          id: prop.id,
          title: `${prop.bhk_type?.replace('_', ' ').toUpperCase() || 'PROPERTY'} ${prop.property_type?.replace('_', ' ').toUpperCase() || 'APARTMENT'}`,
          location: prop.location,
          price: prop.asking_price || 0,
          status: prop.status || 'available',
          type: 'resale' as const,
          created_at: prop.created_at,
          images: prop.images || []
        }))

        const rentalProperties = (rentalData || []).map(prop => ({
          id: prop.id,
          title: `${prop.bhk_type?.replace('_', ' ').toUpperCase() || 'PROPERTY'} ${prop.property_type?.replace('_', ' ').toUpperCase() || 'APARTMENT'}`,
          location: prop.location,
          price: prop.rent_amount || 0,
          status: prop.status || 'available',
          type: 'rental' as const,
          created_at: prop.created_at,
          images: prop.images || []
        }))

        const newProjects = (projectData || []).map(prop => ({
          id: prop.id,
          title: prop.project_name || 'New Project',
          location: prop.project_location || '',
          price: prop.starting_price || 0,
          status: prop.status || 'available',
          type: 'new_project' as const,
          created_at: prop.created_at,
          images: prop.images || []
        }))

        const allProperties = [...resaleProperties, ...rentalProperties, ...newProjects]
        setProperties(allProperties)

        // Calculate statistics
        const stats: PropertyStats = {
          totalProperties: allProperties.length,
          resaleProperties: resaleProperties.length,
          rentalProperties: rentalProperties.length,
          newProjects: newProjects.length,
          availableProperties: allProperties.filter(p => p.status === 'available').length,
          soldProperties: allProperties.filter(p => p.status === 'sold').length,
          pendingProperties: allProperties.filter(p => p.status === 'pending').length
        }
        setStats(stats)

      } catch (err) {
        console.error('Error fetching agent properties:', err)
        setError('Failed to load properties')
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && user) {
      fetchAgentProperties()
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
    <DashboardLayout onPropertyListingClick={() => {}}>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {user?.first_name || 'Agent'}! Manage your property listings.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.availableProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Sold</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.soldProperties}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Type Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resale Properties</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.resaleProperties}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Properties</h3>
              <p className="text-3xl font-bold text-green-600">{stats.rentalProperties}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Projects</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.newProjects}</p>
            </div>
          </div>

          {/* Properties List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
                <Link
                  href="/post-property"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Property
                </Link>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading properties...</p>
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
              ) : properties.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No properties found</p>
                  <Link
                    href="/post-property"
                    className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {properties.map((property) => (
                    <div key={property.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                          <p className="text-gray-600">{property.location}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(property.price)}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              property.status === 'available' ? 'bg-green-100 text-green-800' :
                              property.status === 'sold' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {property.status}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(property.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600">
                            <TrashIcon className="w-4 h-4" />
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
    </DashboardLayout>
  )
}