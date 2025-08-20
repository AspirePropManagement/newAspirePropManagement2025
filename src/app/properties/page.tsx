'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * Properties page that displays available properties
 * Shows different content for authenticated vs non-authenticated users
 */
export default function PropertiesPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock properties data - in a real app, this would come from the database
  const mockProperties = [
    {
      id: 1,
      title: 'Modern Family Home',
      price: 450000,
      location: 'Downtown Area',
      type: 'residential',
      status: 'available',
      bedrooms: 4,
      bathrooms: 3,
      area: '2,200 sq ft',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    },
    {
      id: 2,
      title: 'Luxury Condo',
      price: 320000,
      location: 'City Center',
      type: 'residential',
      status: 'available',
      bedrooms: 2,
      bathrooms: 2,
      area: '1,500 sq ft',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
    },
    {
      id: 3,
      title: 'Commercial Office Space',
      price: 850000,
      location: 'Business District',
      type: 'commercial',
      status: 'available',
      bedrooms: 0,
      bathrooms: 2,
      area: '3,500 sq ft',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    },
    {
      id: 4,
      title: 'Investment Property',
      price: 280000,
      location: 'Suburban Area',
      type: 'residential',
      status: 'sold',
      bedrooms: 3,
      bathrooms: 2,
      area: '1,800 sq ft',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    }
  ]

  const filteredProperties = mockProperties.filter(property => {
    if (selectedType !== 'all' && property.type !== selectedType) return false
    if (selectedStatus !== 'all' && property.status !== selectedStatus) return false
    return true
  })

  const handlePropertyClick = (propertyId: number) => {
    if (isAuthenticated) {
      // In a real app, this would navigate to property details
      router.push(`/properties/${propertyId}`)
    } else {
      // Redirect to login if not authenticated
      router.push('/auth')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Perfect Property</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover a wide range of properties including residential homes, commercial spaces, and investment opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedType('all')
                  setSelectedStatus('all')
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handlePropertyClick(property.id)}
            >
              <div className="relative">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : property.status === 'sold'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
                <p className="text-2xl font-bold text-orange-600 mb-3">
                  ${property.price.toLocaleString()}
                </p>
                
                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {property.location}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div className="text-center">
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div>Bedrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div>Bathrooms</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{property.area}</div>
                    <div>Area</div>
                  </div>
                </div>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg transition-colors">
                  {isAuthenticated ? 'View Details' : 'Sign In to View'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters to see more properties.</p>
            <button
              onClick={() => {
                setSelectedType('all')
                setSelectedStatus('all')
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
