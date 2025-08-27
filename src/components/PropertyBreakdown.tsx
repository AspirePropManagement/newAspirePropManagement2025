import React from 'react'
import { DashboardStats as DashboardStatsType } from '@/lib/dashboardService'

interface PropertyBreakdownProps {
  stats: DashboardStatsType | null
  isLoading: boolean
}

/**
 * Property breakdown component displaying detailed property statistics
 * Implements the Single Responsibility Principle by only handling property breakdown display
 */
export default function PropertyBreakdown({ stats, isLoading }: PropertyBreakdownProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Breakdown</h2>
        <div className="text-center text-gray-500">No data available</div>
      </div>
    )
  }

  const propertyTypes = [
    {
      title: 'Resale Properties',
      count: stats.totalResaleProperties,
      color: 'bg-blue-500',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Available for purchase'
    },
    {
      title: 'Rental Properties',
      count: stats.totalRentalProperties,
      color: 'bg-green-500',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      description: 'Available for rent'
    },
    {
      title: 'New Projects',
      count: stats.totalNewProjects,
      color: 'bg-purple-500',
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      description: 'Under construction'
    }
  ]

  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Breakdown</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {propertyTypes.map((type, index) => (
          <div key={index} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
              {type.icon}
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{type.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{type.count}</p>
            <p className="text-xs text-gray-500">{type.description}</p>
          </div>
        ))}
      </div>
      
      {/* Total Properties Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-gray-900">Total Properties</span>
          <span className="text-3xl font-bold text-blue-600">{stats.totalProperties}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">Combined count of all property types</p>
      </div>

      {/* User Role Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-gray-600">Agents</p>
            <p className="text-lg font-semibold text-purple-600">{stats.totalAgents}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Builders</p>
            <p className="text-lg font-semibold text-orange-600">{stats.totalBuilders}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Buyers</p>
            <p className="text-lg font-semibold text-green-600">{stats.totalBuyers}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
