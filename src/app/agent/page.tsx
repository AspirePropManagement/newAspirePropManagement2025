'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardPropertyForm from '@/components/DashboardPropertyForm'
import { ScrollArrow } from '@/components/ScrollArrow'
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
  
  const [showPropertyForm, setShowPropertyForm] = useState(false)
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
    <DashboardLayout onPostPropertyClick={() => setShowPropertyForm(true)}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Header - Mobile Responsive */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <span className="text-lg sm:text-xl">🏠</span>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Agent Dashboard</h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2">
                    Welcome back, {user?.first_name || 'Agent'}! Manage your property listings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Available</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.availableProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-orange-100 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingProperties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Sold</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.soldProperties}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Type Breakdown - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Resale Properties</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.resaleProperties}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Rental Properties</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.rentalProperties}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4 sm:p-6 border border-gray-100 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-purple-100 rounded-lg sm:rounded-xl">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">New Projects</h3>
                  <p className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.newProjects}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties List - Mobile Responsive */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Properties</h2>
                <Link
                  href="/post-property"
                  className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base font-medium"
                >
                  <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Add Property
                </Link>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm sm:text-base">Loading properties...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <p className="text-red-600 mb-4 text-sm sm:text-base">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">No properties found</p>
                  <Link
                    href="/post-property"
                    className="inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base font-medium"
                  >
                    <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties.map((property) => (
                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-32 sm:max-w-48">
                              {property.title}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm text-gray-600 truncate max-w-24 sm:max-w-32">
                              {property.location}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {formatPrice(property.price)}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              property.type === 'resale' ? 'bg-blue-100 text-blue-800' :
                              property.type === 'rental' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {property.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              property.status === 'available' ? 'bg-green-100 text-green-800' :
                              property.status === 'sold' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {property.status}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {new Date(property.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <button className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ScrollArrow />

      {/* Property Form Modal */}
      <DashboardPropertyForm
        isOpen={showPropertyForm}
        onClose={() => setShowPropertyForm(false)}
        onSuccess={() => {
          setShowPropertyForm(false);
          // Refresh properties list
          window.location.reload();
        }}
      />
    </DashboardLayout>
  )
}